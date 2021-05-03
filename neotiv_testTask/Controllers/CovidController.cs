using Microsoft.AspNetCore.Mvc;
using neotiv_testTask.Domain;
using neotiv_testTask.Interfaces;
using System;
using System.Linq;

namespace neotiv_testTask.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CovidController : ControllerBase
    {
        private IDataPersistence _dataProvider;

        [HttpPost]
        public IActionResult Add(Person person)
        {
            if (person == null)
                return BadRequest();

            var data = _dataProvider.Get().ToList();
            
            person.ID = data.Count() + 1;
            person.LastChange = DateTime.Now;

            data.Add(person);
            _dataProvider.Save(data);

            return Ok();
        }

        [HttpPost]
        public IActionResult Update(Person person)
        {
            if (person == null)
                return BadRequest();

            var data = _dataProvider.Get();
            var target = data.FirstOrDefault(p => p.ID == person.ID);

            if (target == null)
                return NotFound();
            
            target.LastChange = DateTime.Now;
            target.State = person.State;

            _dataProvider.Save(data);

            return Ok();
        }

        [HttpGet]
        public IActionResult List(string? date, HealthState? state)
        {
            var data = _dataProvider.Get();

            var filtered = data;
            DateTime parsedDate;

            if (state != null)
                filtered = data.Where(p => p.State == state);

            try
            {
                parsedDate = DateTime.Parse(date);
                filtered = filtered.Where(p => p.InfectedOn >= parsedDate);
            }
            catch (Exception) { }
            
            return new JsonResult(filtered);
        }

        [HttpGet]
        public IActionResult Show(int id)
        {
            var person = _dataProvider.Get().FirstOrDefault(p => p.ID == id);

            return new JsonResult(person);
        }

        public CovidController(IDataPersistence provider)
        {
            _dataProvider = provider;
        }
    }
}
