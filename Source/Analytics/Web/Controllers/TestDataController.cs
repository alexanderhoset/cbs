using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Web.TestData;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestDataController : ControllerBase
    {
        // GET api/TestData
        [HttpGet]
        public ActionResult<IEnumerable<string>> GenerateTestData()
        {
            var caseReports = JsonConvert.DeserializeObject<CaseReport[]>(System.IO.File.ReadAllText("TestData/CaseReports.json"));
            var mongoDbHandler = new MongoDBHandler();

            foreach (var caseReport in caseReports)
            {
                var dbCaseEntry = new DbCaseEntry(caseReport.DataCollectorId,
                    caseReport.NumberOfMalesAged5AndOlder,
                    caseReport.NumberOfFemalesUnder5,
                    caseReport.NumberOfFemalesAged5AndOlder,
                    caseReport.NumberOfMalesUnder5,
                    DateTimeOffset.UtcNow,
                    caseReport.HealthRiskId,
                    caseReport.Origin,
                    caseReport.Longitude,
                    caseReport.Latitude);

                mongoDbHandler.insertRecordToDB(dbCaseEntry);
            }
            
            return caseReports.Select(x => x.Message).ToArray();
        }

        // GET api/TestData/delete
        [HttpGet("delete")]
        public string DeleteTestData()
        {
            var mongoDbHandler = new MongoDBHandler();
            mongoDbHandler.deleteAllRecordsFromDB();
            return "test";
        }
    }
}
