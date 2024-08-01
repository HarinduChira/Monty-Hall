using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace WebApplication1.Controllers
{
    [ApiController]
    public class todoController : ControllerBase
    {
        private IConfiguration _configuration;

        public todoController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public class SimulationResult
        {
            public int SelectedDoor { get; set; }
            public int OpenedDoor { get; set; }
            public int PriceDoor { get; set; }
            public string Choice { get; set; }
            public string Status { get; set; }
        }



        [HttpGet("get_result")]
        public JsonResult get_result()
        {
            String query = "SELECT * FROM montyHallResult";
            DataTable dt = new DataTable();

            String sqlDataSource = _configuration.GetConnectionString("mydb");

            SqlDataReader myReader;

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(dt);
        }

        [HttpPost("add_result")]
        public JsonResult add_result([FromBody] SimulationResult result) {

            String query = @"
                INSERT INTO montyHallResult 
                (selectedDoor, openedDoor, priceDoor, choice, status) 
                VALUES 
                (@selectedDoor, @openedDoor, @priceDoor, @choice, @status)";

            DataTable dt = new DataTable();

            String sqlDataSource = _configuration.GetConnectionString("mydb");

            SqlDataReader myReader;

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@selectedDoor", result.SelectedDoor);
                    myCommand.Parameters.AddWithValue("@openedDoor", result.OpenedDoor);
                    myCommand.Parameters.AddWithValue("@priceDoor", result.PriceDoor);
                    myCommand.Parameters.AddWithValue("@choice", result.Choice);
                    myCommand.Parameters.AddWithValue("@status", result.Status);

                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }

                return new JsonResult("Result added successfully");
            }            
        }

    }
}
