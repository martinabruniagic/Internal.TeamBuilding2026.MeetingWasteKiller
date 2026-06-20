namespace Internal.MeetingWasteKiller.SqlServer.Common;

public sealed class SqlServerOptions
{
    public string ConnectionString { get; set; } = string.Empty;

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(ConnectionString))
            throw new InvalidOperationException("SqlServerOptions: ConnectionString is required.");
    }
}
