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
                    var response = context.Response;
                    response.Headers.Add("connection", "keep-alive");
                    response.Headers.Add("cach-control", "no-cache");
                    response.Headers.Add("content-type", "text/event-stream");

                    while (true)
                    {
                        // WriteAsync requires `using Microsoft.AspNetCore.Http`
                        await response.Body
                            .WriteAsync(Encoding.UTF8.GetBytes($"data: {JsonSerializer.Serialize(Datasource.GetData())}\n\n"));

                        await response.Body.FlushAsync();
                        await Task.Delay(5 * 1000);
                    }

                });

                endpoints.MapPost("/stream/add", async context =>
                {
                    using (StreamReader reader = new StreamReader(context.Request.Body, Encoding.UTF8))
                    {
                        // Add to Data
                        var data = await reader.ReadToEndAsync();
                        // var entry = JsonSerializer.Deserialize<Data>(data);
                        // _data.Add(entry);
                    }

                });
            });
        }
    }
}
