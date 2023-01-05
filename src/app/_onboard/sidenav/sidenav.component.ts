import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';
import { ChatService } from 'src/app/_services/chat.service';
import { AddSimpleTicketComponent } from 'src/app/add-simple-ticket/add-simple-ticket.component';
import { MatDialog } from '@angular/material';


interface MenuNode {
  name: string;
  url: string;
  icon: string;
  hide: boolean;
  children?: MenuNode[];
}

interface ExampleMenuNode {
  expandable: boolean;
  name: string;
  url: string;
  icon: string;
  hide: boolean;
  level: number;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = this.auth.isLoggedIn();
  logourl = environment.logourl;
  title = environment.title;
  AgentDetails = undefined;
  role: RoleMaster = this.auth.getLoggedInRole();
  TREE_DATA = [];
  unreadTexts = '0';
  constructor(private route: Router, public auth: AuthService,
    changeDetectorRef: ChangeDetectorRef, private cs: ChatService,
    media: MediaMatcher, public dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.TREE_DATA = [
      { name: 'Home', url: '', icon: '<img class="mb-1" src="./assets/icons/home2.png" width="15" height="15">', hide: false },
      { name: 'Apply Leave', url: '/profile/overview/apply-leave', icon: '<i class="far fa-calendar-plus text-muted"></i>', hide: false },
      { name: 'My Teams', url: 'teams/boards', icon: '<i class="fas fa-users text-muted"></i>', hide: false },
      {
        name: 'Products', url: '', icon: '<img class="mb-1" src="./assets/icons/product2.png" width="15" height="15">', hide: (this.role.product != 'Full Access'),
        children: [
          { name: 'Add Products', url: 'product/add-product', icon: '<img class="mb-1" src="./assets/icons/add_product2.png" width="15" height="15">' },
          { name: 'View All Products', url: 'product/view-product', icon: '<img class="mb-1" src="./assets/icons/view_product2.png" width="15" height="15">' },
          { name: 'Stock Entry', url: 'product/stock-entry', icon: '<img class="mb-1" src="./assets/icons/stock-report.png" width="15" height="15">' },
          { name: 'Stock Report', url: 'product/stock-report', icon: '<img class="mb-1" src="./assets/icons/stock-report.png" width="15" height="15">' },
          {
            name: 'Fabrication', url: '', icon: '<i class="fas fa-industry text-muted"></i>',
            children: [
              { name: 'Raw Material Requests', url: 'product/fabrication/requests-raw-materials', icon: '' },
              { name: 'Fabrication Report', url: 'product/fabrication/report', icon: '' },
            ]
          }
        ]
      },
      {
        name: 'Institutes', url: '', icon: '<img class="mb-1" src="./assets/icons/inst2.png" width="15" height="15">', hide: (this.role.institute != 'Full Access'),
        children: [
          { name: 'Register Institute', url: '/institute/register', icon: '<img class="mb-1" src="./assets/icons/institute2.png" width="15" height="15">' },
          { name: 'Institute Details', url: '/institute/institute-detail', icon: '<img class="mb-1" src="./assets/icons/inst_details2.png" width="15" height="15">' },
          { name: 'View/Add Inst Products', url: '/institute/inst-product', icon: '<img class="mb-1" src="./assets/icons/inst_product2.png" width="15" height="15">' },
          { name: 'AMC Records', url: '/institute/amc-records', icon: '<img class="mb-1" src="./assets/icons/amc_record2.png" width="15" height="15">' },
          { name: 'AMC Reminders', url: '/institute/amc-reminders', icon: '<img class="mb-1" src="./assets/icons/inst_details2.png" width="15" height="15">' },
          { name: 'Institute Import', url: '/institute/institute-import', icon: '<img class="mb-1" src="./assets/icons/inst_import.png" width="15" height="15">' },
          { name: 'Bulk Institute Update', url: '/institute/institute-datachange-import', icon: '<img class="mb-1" src="./assets/icons/inst_import.png" width="15" height="15">' },
        ]
      },
      { name: 'Suppliers/Vendors', url: '/vendor/view-vendors', icon: '<img class="mb-1" src="./assets/icons/supplier2.png" width="15" height="15">', hide: (this.role.supplier != 'Full Access') },
      {
        name: 'Lead Management', url: '', icon: '<i class="fas fa-filter text-muted"></i>', hide: (this.role.leadManagement != 'Full Access'),
        children: [
          { name: 'Dashboard', url: '/lead-management/dashboard', icon: '<img class="mb-1" src="./assets/icons/hr-dashboard.png" width="15" height="15">' },
          { name: 'Leads', url: '/lead-management/reports/leads', icon: '<i class="fas fa-filter text-muted"></i>' },
          { name: 'Create Lead', url: '/lead-management/create', icon: '<i class="fas fa-filter text-muted"></i>' },
          { name: 'Upload Lead Details', url: '/lead-management/create/upload', icon: '<i class="fas fa-filter text-muted"></i>' },
          { name: 'Activity-report', url: '/lead-management/reports/activities', icon: '<i class="fas fa-filter text-muted"></i>' },
          {
            name: 'Mails', url: '', icon: '<i class="fas fa-envelope text-muted"></i>',
            children: [
              { name: 'Mail Templates', url: '/lead-management/mail/templates', icon: '<i class="fas fa-envelope text-muted"></i>' },
              { name: 'Mail Sent Status', url: '/lead-management/mail/sent-status', icon: '<i class="fas fa-mail-bulk text-muted"></i>' },
            ]
          },
        ]
      },
      {
        name: 'Sales', url: '', icon: '<img class="mb-1" src="./assets/icons/sales2.png" width="15" height="15">', hide: (this.role.sales != 'Full Access'),
        children: [
          { name: 'Dashboard', url: '/sales', icon: '<img class="mb-1" src="./assets/icons/hr-dashboard.png" width="15" height="15">' },
          { name: 'AMC Dashboard', url: '/sales/amc-dashboard', icon: '<img class="mb-1" src="./assets/icons/hr-dashboard.png" width="15" height="15">' },
          { name: 'Deals', url: '/sales/deals', icon: '<img class="mb-1" src="./assets/icons/quotation2.png" width="15" height="15">' },
          { name: 'Quotations', url: '/sales/quotations', icon: '<img class="mb-1" src="./assets/icons/quotation2.png" width="15" height="15">' },
          { name: 'Purchase Orders', url: '/sales/purchase-orders', icon: '<img class="mb-1" src="./assets/icons/invoice2.png" width="15" height="15">' },
          { name: 'Project Implementation', url: '/sales/project-implementations', icon: '<img class="mb-1" src="./assets/icons/invoice2.png" width="15" height="15">' },
          { name: 'Sales orders', url: '/sales/sales-orders', icon: '<img class="mb-1" src="./assets/icons/invoice2.png" width="15" height="15">' },
          { name: 'Proforma Invoices', url: '/sales/proforma-invoices', icon: '<img class="mb-1" src="./assets/icons/invoice2.png" width="15" height="15">' },
          { name: 'Invoices', url: '/sales/invoices', icon: '<i class="fas fa-file-invoice text-muted"></i>' },
          { name: 'Invoice Reminders', url: '/sales/invoices/reminders', icon: '<i class="fas fa-file-invoice text-muted"></i>' },
          { name: 'Delivery Challans', url: '/sales/delivery-challans', icon: '<i class="fas fa-file-invoice text-muted"></i>' },
          { name: 'Payments', url: '/sales/payments', icon: '<i class="fas fa-rupee-sign text-muted"></i>' },
          {
            name: 'Settings', url: '', icon: '<i class="fas fa-cog text-muted"></i>',
            children: [
              { name: 'Invoice Reminder Settings', url: '/sales/settings/invoice-reminder', icon: '' },
            ]
          },
        ]
      }, {
        name: 'Purchase Inputs', url: '', icon: '<i class="fas fa-shopping-cart text-muted"></i>', hide: (this.role.purchaseInput != 'Full Access'),
        children: [
          { name: 'Orders', url: '/purchase-inputs/orders', icon: '<img class="mb-1" src="./assets/icons/quotation2.png" width="15" height="15">' },
          { name: 'Bills', url: '/purchase-inputs/bills', icon: '<img class="mb-1" src="./assets/icons/quotation2.png" width="15" height="15">' },
          { name: 'Bill Payments', url: '/purchase-inputs/bill-payment', icon: '<img class="mb-1" src="./assets/icons/invoice2.png" width="15" height="15">' }
        ]
      },
      {
        name: 'Accounting', url: '', icon: '<i class="fas fa-cash-register text-muted"></i>', hide: (this.role.sales != 'Full Access'),
        children: [
          { name: 'Dashboard', url: '/accounting/dashboard', icon: '<img class="mb-1" src="./assets/icons/hr-dashboard.png" width="15" height="15">' },
          { name: 'Staff Expense Ledger', url: '/accounting/staff-expense-ledger', icon: '<i class="fas fa-book text-muted"></i>' },
          { name: 'Accounting Report', url: '/accounting/accounting_report', icon: '<img class="mb-1" src="./assets/icons/accounting_report.png" width="15" height="15">' },
          { name: 'BankStatement Import', url: '/accounting/bank_statement_import', icon: '<img class="mb-1" src="./assets/icons/accounting_report.png" width="15" height="15">' },
        ]
      },
      {
        name: 'HR', url: '', icon: '<img class="mb-1" src="./assets/icons/hr.png" width="20" height="20">', hide: (this.role.hr != 'Full Access'),
        children: [
          { name: ' HR Dashboard', url: 'hr/dashboard', icon: '<img class="mb-1" src="./assets/icons/hr-dashboard.png" width="15" height="15">' },
          {
            name: 'Salary', url: '', icon: '<img class="mb-1" src="./assets/icons/salary_details.png" width="15" height="15">',
            children: [
              { name: 'Salary Details', url: 'hr/salary-details', icon: '' },
              { name: 'Salary Entries', url: 'hr/salary-entries', icon: '' },
            ]
          },
          {
            name: 'Agents', url: '', icon: '<img class="mb-1" src="./assets/icons/agent2.png" width="15" height="15">',
            children: [
              { name: 'Add Agent', url: 'hr/agent/agent-register', icon: '<i class="fas fa-user-plus text-muted"></i>' },
              { name: 'View Agents', url: 'hr/agent/view-agents', icon: '<i class="fas fa-users text-muted"></i>' },
              { name: 'Role Master', url: 'hr/agent/role-master', icon: '<i class="fas fa-users-cog text-muted"></i>' },
            ]
          },
          {
            name: 'Leave Management', url: '', icon: '<i class="far fa-calendar-alt text-muted"></i>',
            children: [
              { name: 'Leave Masters', url: 'hr/leave-management/leave-masters', icon: '<i class="fas fa-calendar-week text-muted"></i>' },
              { name: 'Leaves Applied', url: 'hr/leave-management/leaves-applied-report', icon: '<i class="far fa-calendar-check text-muted"></i>' },
              { name: 'Leaves Balances', url: 'hr/leave-management/leave-balances', icon: '<i class="fas fa-calendar-day text-muted"></i>' }
            ]
          },
        ]
      },
      {
        name: 'Admin', url: '', icon: '<img src="./assets/icons/admin2.png" width="15" height="15">', hide: (this.role.admin != 'Full Access'),
        children: [
          { name: 'Company details', url: 'admin/info-details', icon: '<img class="mb-1" src="./assets/icons/institute2.png" width="15" height="15">' },
          { name: 'Generate Working Days', url: 'admin/generate-working-days', icon: '<img class="mb-1" src="./assets/icons/calender_days2.png" width="15" height="15">' },
          { name: 'View Working Days', url: 'admin/view-working-days', icon: '<img class="mb-1" src="./assets/icons/view_days2.png" width="15" height="15">' },
          { name: 'Attendance', url: 'admin/attendance', icon: '<img src="./assets/icons/attendance.png" width="15" height="15">' },
          { name: 'Attendance Report', url: 'admin/attendance-report', icon: '<img src="./assets/icons/attendance.png" width="15" height="15">' },
          { name: 'Site Attendance', url: 'admin/site-attendance', icon: '<img class="mb-1" src="./assets/icons/site_attendance2.png" width="15" height="15">' },
          { name: 'Mail Settings', url: 'admin/mail-settings', icon: '<i class="fas fa-mail-bulk text-muted"></i>' },
          { name: 'Letterpad', url: 'sales/letterpad', icon: '<img class="mb-1" src="./assets/icons/amc_report2.png" width="15" height="15">&nbsp;' },
        ]
      },
      {
        name: 'Tickets', url: '', icon: '<img class="mb-1" src="./assets/icons/main_ticket2.png" width="15" height="15">', hide: (this.role.tickets != 'Full Access'),
        children: [
          { name: 'Dashboard', url: 'tickets/dashboard', icon: '<img class="mb-1" src="./assets/icons/ticket2.png" width="15" height="15">', hide: !this.role.ticketsAdmin },
          { name: 'New Ticket', url: 'add-ticket', icon: '<img class="mb-1" src="./assets/icons/ticket2.png" width="15" height="15">', hide: !this.role.ticketsAdmin },
          { name: 'Gmail Tickets', url: 'gmail-tickets', icon: '<img class="mb-1" src="./assets/icons/mail2.png" width="15" height="15">', hide: !this.role.ticketsAdmin },
          { name: 'Project Implementaions', url: 'project-implementations', icon: '<img class="mb-1" src="./assets/icons/mail2.png" width="15" height="15">' },
          { name: 'My Office Expense Ledger', url: 'profile/ledger', icon: '<img class="mb-1" src="./assets/icons/mail2.png" width="15" height="15">' },
        ]
      },
      {
        name: 'Reports', url: '', icon: '<img class="mb-1" src="./assets/icons/report2.png" width="15" height="15">', hide: (this.role.reports != 'Full Access'),
        children: [
          { name: 'Ticket Report', url: 'reports/ticket-report', icon: '<img class="mb-1" src="./assets/icons/ticket_report2.png" width="15" height="15">' },
          { name: 'Institute Report', url: 'reports/institute-report', icon: '<img class="mb-1" src="./assets/icons/inst_report2.png" width="15" height="15">' },
          { name: 'Inst.Contact Report', url: 'reports/institutecontact-report', icon: '<img class="mb-1" src="./assets/icons/amc_report2.png" width="15" height="15">&nbsp;' },
          { name: 'Agent Report', url: 'reports/agent-report', icon: '<img class="mb-1" src="./assets/icons/amc_report2.png" width="15" height="15">&nbsp;', },
          { name: 'Call Report', url: 'reports/call-report', icon: '<img class="mb-1" src="./assets/icons/amc_report2.png" width="15" height="15">&nbsp;' },
          { name: 'Service Report', url: 'reports/service-report', icon: '<img class="mb-1" src="./assets/icons/amc_report2.png" width="15" height="15">&nbsp;' },
          { name: 'Amc Report', url: 'reports/amc-report', icon: '<img class="mb-1" src="./assets/icons/amc_report2.png" width="15" height="15">&nbsp;' },

        ]
      },

    ];

    console.log(this.TREE_DATA);

    this.dataSource.data = this.TREE_DATA;
  }

  ngOnInit() {
    // if (this.isLoggedIn)
    //   this.loginAgentType = this.auth.getLoginAgentType();

    this.auth.getAgentDetailsObs().subscribe(ad => this.AgentDetails = ad);
    this.getUnreadMessages(this.AgentDetails.emailId);

  }

  openSimpleToDo() {
    const dialogRef = this.dialog.open(AddSimpleTicketComponent, {
      width: '450px',
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  logout() {
    localStorage.clear();
    window.location.href = "./";
  }

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  onActivate(event) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = true;

  // -- Side menu Content

  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      url: node.url,
      icon: node.icon,
      hide: node.hide,
      level: level,
    };
  }

  getUnreadMessages(email_id) {
    this.cs.getUnreadCount(email_id).subscribe(res => {
      console.log(res);
      this.unreadTexts = res['unreadTexts'];
      console.log(this.unreadTexts);
    });
  }

  editAgentDetails(employeeId) {
    this.route.navigateByUrl('/profile');
  }

  treeControl = new FlatTreeControl<ExampleMenuNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleMenuNode) => node.expandable;
}
