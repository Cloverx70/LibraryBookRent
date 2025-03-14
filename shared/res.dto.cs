public class Res<T>
{
    public int Code { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }

    public Res(int statusCode, string message, T? data = default)
    {
        Code = statusCode;
        Message = message;
        Data = data;
    }
}
