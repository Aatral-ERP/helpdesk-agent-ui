import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Product } from '../_product/Product';
import { AuthService } from './auth.service';
import { StockEntry } from '../_product/StockEntry';
import { RoleMasterComponent } from '../_admin/role-master/role-master.component';
import { RoleMaster } from '../_admin/role-create/RoleMaster';
import { RawMaterialRequest } from '../_product/request-raw-materials/RawMaterialRequest';
import { RawMaterialRequestProducts } from '../_product/request-raw-materials/RawMaterialRequestProducts';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(private http: HttpClient, public auth: AuthService) { }

  saveInstitute(inst) {
    // let request = {
    //   "instituteId": instituteId, "instituteName": instituteName, "instituteType": instituteType, "street1": street1,
    //   "street2": street2, "city": city, "state": state, "country": country,
    //   "zipcode": zipcode, "phone": phone, "alternatePhone": alternatePhone, "emailId": emailId,
    //   "alternateEmailId": alternateEmailId, "gstno": gstno, "serviceUnder": serviceUnder
    // };
    if (inst.instituteId == '0' || inst.instituteId.length == 0)
      return this.http.post(environment.apiUrl + '/institute/save-institute', inst);
    else
      return this.http.post(environment.apiUrl + '/institute/edit-institute', inst);

  }

  saveAgent(agent) {
    return this.http.post(environment.apiUrl + 'agent/save-agent', agent);

  }
  getAllAgent(company) {
    let request = {
      "company": company
    };
    return this.http.post(environment.apiUrl + 'agent/get-agents', request);

  }

  deleteAgent(employeeId) {
    let request = {
      "employeeId": employeeId
    };
    return this.http.post(environment.apiUrl + 'agent/delete-agent', request);
  }

  getAgentDetails(AgentId) {
    return this.http.get(environment.apiUrl + 'agent/get-Agent-Details/' + AgentId);
  }

  instituteReport(set_from, set_to, instituteId, instituteName, instituteType, productType, serviceUnder) {
    let request = {
      "SearchInstitutionReq": {
        "set_from": set_from, "set_to": set_to, "instituteId": instituteId,
        "instituteName": instituteName, "instituteType": instituteType, "productType": productType, "serviceUnder": serviceUnder
      }
    };
    return this.http.post(environment.apiUrl + 'agent/institute-report', request);
  }

  loadInstituteDetails() {
    let request = { "loadInstitutionReq": {} };
    return this.http.post(environment.apiUrl + 'agent/load-institute', request);
  }

  saveProduct(product: Product) {
    return this.http.post(environment.apiUrl + 'agent/save-product', product);
  }

  getProducts() {
    let request = {};

    return this.http.post(environment.apiUrl + 'agent/get-products', request);
  }

  deleteProduct(id) {
    let request = { "id": id };
    return this.http.post(environment.apiUrl + 'agent/delete-product', request);
  }

  getProductDetails(ProductId) {
    return this.http.get(environment.apiUrl + 'agent/get-Product-Details/' + ProductId);
  }

  changeLeaveMaster(req) {
    return this.http.post(environment.apiUrl + 'agent/change-agent-leave-master/', req);
  }

  forgetPassword(username) {
    let request = { "SendOTPReq": { "username": username } };
    return this.http.post(environment.apiUrl + 'agent/forgetPassword', request);
  }

  verifyOTP(username, otp) {
    let request = { "CheckOTPReq": { "username": username, "otp": otp } };
    return this.http.post(environment.apiUrl + 'agent/checkOTP', request);
  }

  updatePassword(username, new_password) {
    let request = { "ResetPasswordReq": { "username": username, "new_password": new_password } };
    return this.http.post(environment.apiUrl + 'agent/resetPassword', request);
  }

  addWorkingDates(workingDays) {
    let request = { "workingDays": workingDays };
    return this.http.post(environment.apiUrl + '/attendance/add-working-day', request);
  }

  getWorkingDays(fromDate, toDate) {
    let request = { fromDate: fromDate, toDate: toDate };
    return this.http.post(environment.apiUrl + '/attendance/get-working-day', request);
  }

  deleteWorkingDates(workingDays) {
    let request = { "workingDays": workingDays };
    return this.http.post(environment.apiUrl + '/attendance/delete-working-day', request);
  }

  saveAllAttendance(attendances) {
    let request = { attendances: attendances };
    return this.http.post(environment.apiUrl + '/attendance/save-all-attendance', request);
  }

  markAttendance(attendace) {
    return this.http.post(environment.apiUrl + '/attendance/mark-attendance', attendace);
  }

  getAttendance(fromDate, toDate, agents = []) {
    let request = { fromDate: fromDate, toDate: toDate, agents: agents };
    return this.http.post(environment.apiUrl + '/attendance/get-all-attendance', request);
  }

  getSiteAttendances(institutes, agents, fromDate, toDate) {
    let request = {
      institutes: institutes, agents: agents, fromDate: fromDate, toDate: toDate, pageNo: 0, noOfRecords: 100000
    };
    return this.http.post(environment.apiUrl + '/attendance/get-all-site-attendance', request);
  }

  getInstituteProductsAllReportData() {
    return this.http.post(environment.apiUrl + '/institute/get-institute-products-all-report-data', null);
  }

  getInstituteProductsAll(institutes, products, serviceUnders, fromDate, toDate, prepareAMCDashboardData) {
    let request = {
      institutes: institutes,
      products: products,
      serviceUnders: serviceUnders,
      fromDate: fromDate, toDate: toDate,
      prepareAMCDashboardData: prepareAMCDashboardData
    }
    return this.http.post(environment.apiUrl + '/institute/get-institute-products-all', request);
  }

  saveInstituteProducts(instituteProducts) {
    let request = {
      instituteProducts: instituteProducts
    }
    return this.http.post(environment.apiUrl + '/institute/save-institute-products-all', request);
  }

  autocompleteDesignation() {
    let request = { "designation": "designation" };
    return this.http.post(environment.apiUrl + '/agent/needed', request);
  }

  getInfoDetails(id) {
    let request = { "id": id };
    return this.http.post(environment.apiUrl + '/agent/get-info-details', request);
  }
  saveInfoDetails(infoDetails) {
    return this.http.post(environment.apiUrl + '/agent/save-info-details', infoDetails);
  }

  saveLogo(file) {
    let form = new FormData();
    form.append('file', file);
    return this.http.post(environment.apiUrl + '/agent/upload', form);
  }

  saveRoundSeal(file) {
    let form = new FormData();
    form.append('file', file);
    return this.http.post(environment.apiUrl + '/agent/round-seal-upload', form);
  }

  saveFullSeal(file) {
    let form = new FormData();
    form.append('file', file);
    return this.http.post(environment.apiUrl + '/agent/full-seal-upload', form);
  }

  saveProfilePhoto(photo, employeeId) {
    let form = new FormData();
    form.append('photo', photo);
    form.append('employeeId', employeeId);
    return this.http.post(environment.apiUrl + '/agent/photoUpload', form);
  }

  saveSignature(signature, employeeId) {
    let form = new FormData();
    form.append('signature', signature);
    form.append('employeeId', employeeId);
    return this.http.post(environment.apiUrl + '/agent/signatureUpload', form);
  }

  saveVendor(id, vendorName, address1, address2, city, state, country, pincode, vendorLandLine, vendorPhone, vendorEmail, gstNo, accountName, accountNumber, branchName, ifscCode, bankname) {
    let request = {
      id: id, vendorName: vendorName, address1: address1, address2: address2,
      city: city, state: state, country: country, pincode: pincode,
      vendorLandLine: vendorLandLine, vendorPhone: vendorPhone, vendorEmail: vendorEmail,
      gstNo: gstNo, accountName: accountName, accountNumber: accountNumber, branchName: branchName,
      ifscCode: ifscCode, bankName: bankname
    };

    return this.http.post(environment.apiUrl + '/agent/save-vendor', request);
  }

  deleteVendor(id) {
    let request = { id: id };
    return this.http.post(environment.apiUrl + '/agent/delete-vendor', request);
  }

  getVendor(id) {
    let request = { id: id };
    return this.http.post(environment.apiUrl + '/agent/get-vendor', request);
  }

  getAllVendors() {
    let request = {};
    return this.http.post(environment.apiUrl + '/agent/get-vendors-details', request);
  }

  sendAMCReminder(instituteProducts) {
    let request = { instituteProducts: instituteProducts };
    return this.http.post(environment.apiUrl + '/scheduler/sendAMCReminder', request);
  }

  resendAMCReminderMail(log) {
    return this.http.post(environment.apiUrl + '/scheduler/resendAMCReminderMail', log.log);
  }

  loadProjectImplementations(fromDate, toDate) {
    let request = { fromDate: fromDate, toDate: toDate, mailId: this.auth.getLoginEmailId() };
    return this.http.post(environment.apiUrl + '/deals/get-deal-ticket-project-implementations', request);
  }

  saveStockEntry(stockEntry: StockEntry) {
    return this.http.post(environment.apiUrl + '/agent/add-stock-entry', stockEntry);
  }

  getAllStockEntry(product: Product) {
    return this.http.post(environment.apiUrl + '/agent/get-all-stock-entry', product);
  }

  getAllProductsRawMaterials(product: Product) {
    let req = { product: product }
    return this.http.post(environment.apiUrl + '/agent/get-products-raw-materials', req);
  }

  saveProductsRawMaterials(product, productsRawMaterials) {
    let req = { product: product, productsRawMaterials: productsRawMaterials }
    return this.http.post(environment.apiUrl + '/agent/save-products-raw-materials', req);
  }

  updateBulkProducts(products: Array<Product>) {
    return this.http.post(environment.apiUrl + '/agent/update-bulk-products', products);
  }

  saveRole(role: RoleMaster) {
    if (role.id == 0) {
      role.createdBy = this.auth.getLoginEmailId();
    }
    role.modifiedBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + '/agent/save-role-master', role);
  }

  deleteRole(role: RoleMaster) {
    return this.http.post(environment.apiUrl + '/agent/delete-role-master', role);
  }

  loadRoles() {
    return this.http.post(environment.apiUrl + '/agent/get-role-masters', new RoleMaster());
  }

  saveProductsRawMaterialRequest(rawMaterialRequest: RawMaterialRequest, rawMaterialRequestProducts: Array<RawMaterialRequestProducts>, currentAction: string) {
    let req = { rawMaterialRequest: rawMaterialRequest, rawMaterialRequestProducts: rawMaterialRequestProducts, currentAction: currentAction };
    return this.http.post(environment.apiUrl + '/agent/save-products-raw-materials-request', req);
  }

  getProductsRawMaterialRequests() {
    return this.http.post(environment.apiUrl + '/agent/get-products-raw-materials-requests', { emailId: this.auth.getLoginEmailId() });
  }

  deleteProductsRawMaterialRequest(rawMaterialRequest: RawMaterialRequest) {
    let req = { rawMaterialRequest: rawMaterialRequest };
    return this.http.post(environment.apiUrl + '/agent/delete-products-raw-materials-requests', req);
  }

  loadFabricationReport(search_filters) {
    return this.http.post(environment.apiUrl + '/agent/raw-materials-request-report', search_filters);
  }

  loadStockDetails(filters) {
    let req = filters;
    return this.http.post(environment.apiUrl + 'agent/load-stock-details', req);
  }

}
