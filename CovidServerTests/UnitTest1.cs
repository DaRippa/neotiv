using neotiv_testTask.Domain;
using neotiv_testTask.Interfaces;
using neotiv_testTask.Persistence;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CovidServerTests
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestThatStoringDataWorks()
        {
            var data = new List<IPerson>
            {
                new Person{ID = 1, FirstName = "John", LastName="Doe", State=HealthState.Infected, InfectedOn = DateTime.Today, LastChange = DateTime.Now},
                new Person{ID = 2, FirstName = "Jane", LastName="Doe", State=HealthState.Cured, InfectedOn = new DateTime(2021, 02, 10), LastChange = DateTime.Now}
            };

            var writer = new CsvStorage();
            writer.Save(data);
        }

        [Test]
        public void TestThatLoadingDataWorks()
        {
            var reader = new CsvStorage();
            var data = reader.Get();

            Assert.AreEqual(2, data.Count());
        }
    }
}