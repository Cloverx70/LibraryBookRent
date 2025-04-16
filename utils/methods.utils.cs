namespace backend.utils;

public class UtilsMethods
{
    public static void PatchEntity<T>(T entity, object dto)
    {
        var entityType = typeof(T);
        var dtoType = dto.GetType();

        foreach (var dtoProp in dtoType.GetProperties())
        {
            var entityProp = entityType.GetProperty(dtoProp.Name);
            if (entityProp != null && dtoProp.GetValue(dto) != null)
            {
                entityProp.SetValue(entity, dtoProp.GetValue(dto));
            }
        }
    }
}
