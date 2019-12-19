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
        private readonly IRandomNumberProvider _random;

        public Datasource(IRandomNumberProvider random)
        {
            _random = random;
        }
        public IList<Product> GetData()
        {
            var productList = new List<Product>();

            for (int i = 0; i < 10; i++)
            {
                productList.Add(new Product { Id = i + 1, Title = $"Product {i + 1}", Price = _random.Next(5000, 100000) });
            }

            return productList;
        }
    }
}