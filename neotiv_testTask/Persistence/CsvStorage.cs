using neotiv_testTask.Domain;
using neotiv_testTask.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;

namespace neotiv_testTask.Persistence
{
    public class CsvStorage : IDataPersistence
    {
        private readonly string storage; 
        public void Save(IEnumerable<IPerson> data)
        {
            using(var stream = File.Create(storage))
            using(var writer = new StreamWriter(stream))
            {
                foreach(var person in data)
                {
                    writer.WriteLine($"{person.ID};{person.LastName};{person.FirstName};{person.State};{person.InfectedOn.Ticks};{person.LastChange.Ticks}");
                }
            }
        }

        public IEnumerable<IPerson> Get()
        {
            var result = new List<IPerson>();

            try
            {
                using (var stream = File.OpenRead(storage))
                using (var reader = new StreamReader(stream))
                {
                    string line;
                    while ((line = reader.ReadLine()) != null)
                    {
                        var info = line.Split(';');

                        result.Add(new Person
                        {
                            ID = Convert.ToInt32(info[0]),
                            LastName = info[1],
                            FirstName = info[2],
                            State = Enum.TryParse<HealthState>(info[3], out var state) ? state : HealthState.Unknown,
                            InfectedOn = new DateTime(Convert.ToInt64(info[4])),
                            LastChange = new DateTime(Convert.ToInt64(info[5]))
                        });
                    }
                }
            }
            catch (Exception) { }

            return result;
        }

        public CsvStorage()
        {
            var appPath = Path.GetDirectoryName(GetType().Assembly.Location);
            storage = Path.Combine(appPath, "data.csv");
        }
    }
}
