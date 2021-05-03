using neotiv_testTask.Domain;
using System;

namespace neotiv_testTask.Interfaces
{
    public interface IPerson
    {
        int ID { get; set; }
        string LastName { get; set; }
        string FirstName { get; set; }
        HealthState State { get; set; }
        DateTime InfectedOn { get; set; }
        DateTime LastChange { get; set; }
    }
}
