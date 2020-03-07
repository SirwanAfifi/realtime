using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace websocket
{
    public class ChatHub : Hub
    {
        public async Task Message(MessageModel message)
        {
            await Clients.Others.SendAsync("message", message);
        }
    }

    public class MessageModel
    {
        public string UserName { get; set; }
        public string Message { get; set; }
    }
}