using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace websocket
{
    public class ChatHub : Hub
    {
        public async Task Message(string user, string message)
        {
            await Clients.All.SendAsync("message", user, message);
        }
    }
}