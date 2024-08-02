using Microsoft.AspNetCore.Mvc;
using MontyHallAPI.Models;
using System.Collections.Generic;
using System.Linq;

namespace MontyHallAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class MontyHallController : ControllerBase
    {
        private static List<MontyHallResult> results = new List<MontyHallResult>();

        // Adds a new Monty Hall result
        [HttpPost]
        public ActionResult<MontyHallResult> AddResult([FromBody] MontyHallResult input)
        {
            var result = new MontyHallResult
            {
                SelectedDoor = input.SelectedDoor,
                OpenedDoor = input.OpenedDoor,
                PrizeDoor = input.PrizeDoor,
                Choice = input.Choice,
                Status = input.Status
            };

            results.Add(result);
            return result;
        }

        // Retrieves all Monty Hall results
        [HttpGet]
        public ActionResult<IEnumerable<MontyHallResult>> GetAllResults()
        {
            return results;
        }

        // Retrieves Monty Hall results by choice (switch or stay)
        [HttpGet("choice/{choice}")]
        public ActionResult<IEnumerable<MontyHallResult>> GetResultsByChoice(string choice)
        {
            var filteredResults = results.Where(r => r.Choice.ToLower() == choice.ToLower()).ToList();
            if (!filteredResults.Any())
            {
                return NotFound();
            }
            return filteredResults;
        }

        // Deletes all Monty Hall results
        [HttpDelete]
        public IActionResult DeleteAllResults()
        {
            results.Clear();
            return NoContent();
        }
    }
}
