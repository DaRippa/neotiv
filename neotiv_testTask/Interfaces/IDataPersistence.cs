using System.Collections.Generic;

namespace neotiv_testTask.Interfaces
{
    public interface IDataPersistence
    {
        void Save(IEnumerable<IPerson> data);
        IEnumerable<IPerson> Get();
    }
}
