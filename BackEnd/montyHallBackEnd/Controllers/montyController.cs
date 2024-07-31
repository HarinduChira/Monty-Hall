using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace montyHallBackEnd.Controllers
{
    [ApiController]
    public class montyController : ControllerBase
    {

        private IConfiguration configuration;

        public montyController(IConfiguration iConfig)
        {
            configuration = iConfig;
        }

        [HttpGet("get_result")]
        public JsonResult get_result()
        {
            string query = "SELECT * FROM montyHallResult";

            DataTable dataTable = new DataTable();

            string sqlDataSource = configuration.GetConnectionString("montydb");

            SqlDataReader myReader;

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myReader = myCommand.ExecuteReader();
                    dataTable.Load(myReader);
                    myReader.Close();
                    myConnection.Close();
                }
            }

            return new JsonResult(dataTable);

        }
    }
}
