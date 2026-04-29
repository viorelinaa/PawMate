using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.VeterinaryClinic;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/veterinary-clinics")]
public class VeterinaryClinicController : ControllerBase
{
    private readonly IVeterinaryClinicLogic _veterinaryClinicLogic;

    public VeterinaryClinicController()
    {
        var bl = new BusinessLogic();
        _veterinaryClinicLogic = bl.GetVeterinaryClinicLogic();
    }

    [HttpGet("list")]
    public IActionResult GetVeterinaryClinicList()
    {
        var response = _veterinaryClinicLogic.GetVeterinaryClinicList();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetVeterinaryClinic([FromRoute] int id)
    {
        var response = _veterinaryClinicLogic.GetVeterinaryClinicById(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    public IActionResult CreateVeterinaryClinic([FromBody] VeterinaryClinicCreateDto clinic)
    {
        var response = _veterinaryClinicLogic.CreateVeterinaryClinic(clinic);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult UpdateVeterinaryClinic([FromRoute] int id, [FromBody] VeterinaryClinicUpdateDto clinic)
    {
        var response = _veterinaryClinicLogic.UpdateVeterinaryClinic(id, clinic);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult DeleteVeterinaryClinic([FromRoute] int id)
    {
        var response = _veterinaryClinicLogic.DeleteVeterinaryClinic(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }
}
