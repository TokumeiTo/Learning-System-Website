using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace LMS.Backend.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    public async Task JoinUserGroup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userId);
    }

    public async Task JoinPositionGroup(string position)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, position);
    }
}