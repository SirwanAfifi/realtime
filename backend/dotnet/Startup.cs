using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Debug;

namespace dotnet
{
    public class Startup
    {
        private List<Data> _data = new List<Data>();
        private List<Client> _clients = new List<Client>();
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                }));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> loggerDebug)
        {
            app.UseCors("MyPolicy");

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/stream", async context =>
                {
                    var cancellationToken = context.RequestAborted;

                    context.Response.Headers.Add("Content-Type", "text/event-stream");
                    context.Response.Headers.Add("Connection", "keep-alive");
                    context.Response.Headers.Add("Cache-Control", "no-cache");

                    var data = $"data: {JsonSerializer.Serialize(_data)}\n\n";

                    await context.Response.BodyWriter.WriteAsync(Encoding.UTF8.GetBytes(data));

                    var clientId = DateTime.Now.Millisecond;
                    var newClient = new Client
                    {
                        Id = clientId,
                        Res = context.Response
                    };
                    _clients.Add(newClient);

                    while (true)
                    {
                        if (cancellationToken.IsCancellationRequested)
                        {
                            _clients = _clients.Where(c => c.Id != clientId).ToList();
                            loggerDebug.LogWarning($"{clientId} Connection closed");
                            break;
                        }
                    }

                });

                endpoints.MapPost("/stream/add", async context =>
                {
                    using (StreamReader reader = new StreamReader(context.Request.Body, Encoding.UTF8))
                    {
                        // Add to Data
                        var data = await reader.ReadToEndAsync();
                        var entry = JsonSerializer.Deserialize<Data>(data);
                        _data.Add(entry);

                        // Notify
                        foreach (var client in _clients)
                        {
                            var toSent = $"data: {JsonSerializer.Serialize(_data)}\n\n";
                            await client.Res.BodyWriter.WriteAsync(Encoding.UTF8.GetBytes(toSent));
                        }
                    }

                });
            });
        }
    }

    public class Data
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class Client
    {
        public int Id { get; set; }
        public Microsoft.AspNetCore.Http.HttpResponse Res { get; set; }
    }
}
