import { Component, OnInit, Input } from '@angular/core';
import { Agents } from './Agents';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AgentService } from '../../_services/agent.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {


  @Input() agents: Agents;
  constructor(private as: AgentService, private route: Router) { }
  ngOnInit() {
  }
  saveAgent(employeeId, firstName, lastName, emailId, password, designation, fullAddress, gender, phone, blocked, company, agentType, experienceYear, experienceMonth, leavePermit, monthlySalary, dateOfJoining, salaryDate, accountDetails, photo, notes, workingStatus) {

    this.as.saveAgent(employeeId, firstName, lastName, emailId, password, designation, fullAddress, gender, phone, blocked, company, agentType, '', experienceYear, experienceMonth, leavePermit, monthlySalary, dateOfJoining, salaryDate, accountDetails, photo, notes, workingStatus).subscribe(res => {

      console.log('Response:::::::', res);
      if (res['StatusCode'] == '00')
        Swal.fire('', res['StatusDesc']);

      else
        Swal.fire('', res['StatusDesc'], 'warning');
    })
  }

  editAgent(employeeId, firstName, lastName, emailId, password,
    designation, fullAddress, gender, phone, blocked, company,
    agentType, experienceYear, experienceMonth, leavePermit, monthlySalary, dateOfJoining, salaryDate, accountDetails, photo, notes, workingStatus) {
    this.route.navigate(['/agent-register'], {
      queryParams: {
        employeeId: employeeId, firstName: firstName,
        lastName: lastName, emailId: emailId, password: password, designation: designation,
        fullAddress: fullAddress, gender: gender, phone: phone, blocked: blocked, company: company,
        agentType: agentType, experienceYear: experienceYear, experienceMonth: experienceMonth,
        leavePermit: leavePermit, monthlySalary: monthlySalary, dateOfJoining: dateOfJoining, salaryDate: salaryDate,
        accountDetails: accountDetails, photo: photo, notes: notes, workingStatus: workingStatus
      }
    });
  }

  editAgentDetails(employeeId) {
    this.route.navigateByUrl('/hr/agent/agent-register?edit=1&aid=' + employeeId);
  }

  deleteAgent(employeeId) {
    this.as.deleteAgent(employeeId).subscribe(res => {

      console.log('Response', res);

      if (res['StatusCode'] == '00') {
        Swal.fire('', res['StatusDesc']);
        window.location.reload();
      }

      else
        Swal.fire('', res['StatusDesc'], 'warning');

    })
  }

}
