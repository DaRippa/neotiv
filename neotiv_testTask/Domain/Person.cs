using neotiv_testTask.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neotiv_testTask.Domain
{
    public class Person : IPerson
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime InfectedOn { get; set; }
        public HealthState State { get; set; }
        public DateTime LastChange { get; set; }
    }
}
