using System.Collections.Generic;

namespace dotnet
{

    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
    }

    public class Datasource
    {
        public static IList<Product> GetData()
        {
            var productList = new List<Product>();

            for (int i = 0; i < 1000; i++)
            {
                productList.Add(new Product { Id = i + 1, Title = $"Product {i + 1}", Price = i + 2 * 50 });
            }

            return productList;
        }
    }
}