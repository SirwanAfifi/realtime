using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.Extensions.DependencyInjection;
using websocket;

namespace dotnet
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            {
                builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithOrigins("http://localhost:3000");
            }));
            services.AddSignalR();
        }
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("CorsPolicy");


            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>("/chatHub", options =>
                {
                    options.Transports = HttpTransportType.WebSockets;
                });
            });
        }
    }
}
