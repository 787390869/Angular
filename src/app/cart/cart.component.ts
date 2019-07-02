import {Component, ElementRef, OnInit, TemplateRef} from '@angular/core';
import {CartService} from '../cart.service';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BsModalService, BsModalRef} from 'ngx-bootstrap';
import {ignore} from 'selenium-webdriver/testing';
import {transformAll} from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  condition = '正在检测...';
  modalRef: BsModalRef;
  // 驾驶员数据
  drivers: any = [];
  // 驾驶员总量
  count;
  // 每一页的数量
  size = 10;
  // 排序方式
  sort = 1;
  // 当前页码
  currentPage = 0;
  // 页码总量
  pageCount;
  // 驾驶员生日
  birthday;
  // 页脚
  pageli: any[] = [1, 2, 3, 4, 5];
  // 检测结果
  test1 = false; test2 = false; test3 = false; test4 = false; test5 = false;
  // 编辑页面检查结果
  test6 = true; test7 = true; test8 = true; test9 = true; test10 = true; test11 =true;
  // 驾驶员姓名
  drivername;
  // 驾驶员性别
  driversex = '男';
  //  驾驶员电话
  drivertelnumber;
  // 驾驶员婚姻
  drivermaritalstatus = '未婚';
  // 驾驶员身份证号
  driveridentitynumber;
  // 驾驶员所属公司
  drivercompany;
  // 驾驶员学历
  driveracademic;
  // 驾驶员英语水平
  driverenglishskills;
  // 驾驶员国籍
  drivernationality;
  // 用户键入的需要模糊查询的电话
  userKeyupTelnumber;
  // 用户键入的需要模糊查询的驾驶员姓名
  userKeyupDrivername;
  // 数据Flag 1=>所有数据 2=>根据电话查询的数据 3=>根据姓名查找的数据
  dataFlag = 1;
  // 编辑页面的驾驶员信息
  updateDrivername;
  updateDriversex = '男';
  updateDrivertelnumber;
  updateDriverBirthday;
  updateDrivermaritalstatus = '未婚';
  updateDriveridentitynumber;
  updateDrivercompany;
  updateDriveracademic;
  updateDriverenglishskills;
  updateDrivernationality;
  constructor(private route: ActivatedRoute, private http: HttpClient, private modalService: BsModalService , private el: ElementRef) {
    this.getData();
    this.http.get('api/Driver/getCountOfDriver').subscribe(data => {
      this.count = data;
      this.changePageLi();
    });
  }
  ngOnInit() {
  }
  // 生成页脚页码
  changePageLi() {
    // tslint:disable-next-line:radix
    this.pageCount = parseInt (String(this.count / this.size));
    if (this.count % this.size !== 0) {
      this.pageCount++;
    }
    if (this.pageCount > 5) {
      this.pageli.splice(0, this.pageli.length);
      this.pageli.push(1); this.pageli.push(2); this.pageli.push('...');
      this.pageli.push(this.pageCount - 1); this.pageli.push(this.pageCount);
    } else {
      this.pageli.splice(0, this.pageli.length);
      for (let index = 0; index < this.pageCount; index++) {
        this.pageli.push(index + 1);
      }
    }
  }
  // 所有数据的渲染
  getData() {
    this.http.get('api/Driver/getAllDriver/' + this.currentPage + '/' + this.size + '/' + this.sort).subscribe(data => {
      this.drivers = data;
    });
  }
  // 根据电话号码模糊查询渲染
  telnumberSerachRender() {
    this.dataFlag = 2;
    const requestParam = {
      drivertelnumber: this.userKeyupTelnumber,
      page: this.currentPage,
      size: this.size
    }
    const requestParam2 = {
      drivertelnumber: this.userKeyupTelnumber
    }
    // @ts-ignore
    this.http.get('api/Driver/findDriverByTel', {params: requestParam}).subscribe(data => {
      this.drivers = data ;
      this.http.get('api/Driver/drivertelCount', {params: requestParam2}).subscribe(back => {
        this.count = back;
        this.changePageLi();
      });
    });
  }
  // 根据用户名模糊查询渲染
  drivernameSearchRender() {
    this.dataFlag = 3;
    const requestParam = {
      drivername: this.userKeyupDrivername,
      page: this.currentPage,
      size: this.size
    }
    const requestParam2 = {
      drivername: this.userKeyupDrivername
    }
    // @ts-ignore
    this.http.get('api/Driver/findDriverByName', {params: requestParam}).subscribe(data => {
      this.drivers = data;
      this.http.get('api/Driver/drivernameCount', {params: requestParam2}).subscribe(back => {
        this.count = back;
        this.changePageLi();
      });
    });
  }
  // 改变排序方式
  changeSort(sort) {
    this.sort = sort;
    if (this.dataFlag === 1) {
      this.getData();
    }
    if (this.dataFlag === 2) {
      this.telnumberSerachRender();
    }
    if (this.dataFlag === 3) {
      this.drivernameSearchRender();
    }
  }
  // 下一页
  next() {
    if (this.currentPage < this.pageCount - 1) {
      this.currentPage = this.currentPage + 1;
      if (this.dataFlag === 1) {
        this.getData();
      }
      if (this.dataFlag === 2) {
        this.telnumberSerachRender();
      }
      if (this.dataFlag === 3) {
        this.drivernameSearchRender();
      }
    }
  }
  // 上一页
  last() {
    if ( this.currentPage > 0) {
      this.currentPage = this.currentPage - 1;
      if (this.dataFlag === 1) {
        this.getData();
      }
    }
  }
  // 跳转
  jump(event) {
    if (event.target.innerHTML !== '...' && event.target.innerHTML > 0 && event.target.innerHTML <= this.pageCount ) {
      this.currentPage = event.target.innerHTML - 1;
      if (this.dataFlag === 1) {
        this.getData();
      }
      if (this.dataFlag === 2) {
        this.telnumberSerachRender();
      }
      if (this.dataFlag === 3) {
        this.drivernameSearchRender();
      }
    }
  }
  // 输入跳转
  jumpInput() {
   if (this.currentPage >= 0 && this.currentPage < this.pageCount ) {
     if (this.dataFlag === 1) {
       this.getData();
     }
     if (this.dataFlag === 2) {
       this.telnumberSerachRender();
     }
     if (this.dataFlag === 3) {
       this.drivernameSearchRender();
     }
   } else {
     alert(('页码为0到' + (this.pageCount - 1)));
   }
  }
  // 新增驾驶员
  addDriver() {
    if (this.test1 && this.test2 && this.test3 && this.test4 && this.test5 ) {
      const requertParams = {
        drivername: this.drivername,
        driversex: this.driversex,
        drivertelnumber: this.drivertelnumber,
        birthday: this.birthday,
        driveridentitynumber: this.driveridentitynumber,
        drivermaritalstatus: this.drivermaritalstatus,
        drivercompany: this.drivercompany,
        academic: this.driveracademic,
        driverenglishskills: this.driverenglishskills,
        drivernationality: this.drivernationality
      }
      this.http.get('api/Driver/addDriver/', {params: requertParams})
        .subscribe(data => {
          const respose: any = data;
          if (respose.back === '添加驾驶员成功!') {
            alert(respose.back);
            this.modalRef.hide();
            this.getData();
          }
        });
    } else {
      this.condition = '检测不合格,请填写正确数据!';
    }
  }
  // 改变每一页的数量
  changeSize(size) {
    this.size = size;
    this.getData();
    this.changePageLi();
  }
  // 删除驾驶员
  deleteDriver() {
    const allCheckedDriver = $('input[type="checkbox"]:checked');
    if (allCheckedDriver.length === 0) {
      alert('请选择需要删除的驾驶员!');
    } else {
      for (const i of allCheckedDriver) {
        this.http.get('api/Driver/deleteDriverById/' + i.parentElement.nextElementSibling.innerHTML).subscribe(data => {
          const respose: any = data;
          alert(respose.back);
          this.getData();
          this.jump(1);
        });
      }
    }
  }
  // 打开模态框
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  // 打开编辑框
  openUpdateModal(template: TemplateRef<any>) {
    const checkedDriver = $('input[type="checkbox"]:checked');
    if (checkedDriver.length === 1) {
      this.modalRef = this.modalService.show(template);
      this.http.get('api/Driver/findDriverById/' + checkedDriver.parent().next().text()).subscribe(response => {
        const data: any = response;
        this.updateDrivername = data.drivername;
        this.updateDriversex = data.driversex;
        this.updateDrivertelnumber = data.drivertelnumber;
        this.updateDriverBirthday = data.driverbirthday;
        this.updateDrivermaritalstatus = data.drivermaritalstatus;
        this.updateDriveridentitynumber = data.driveridentitynumber;
        this.updateDrivercompany = data.drivercompany;
        this.updateDriveracademic = data.driveracademic;
        this.updateDriverenglishskills = data.driverenglishskills;
        this.updateDrivernationality = data.drivernationality;
      });
    } else {
      alert('请选中一个需要编辑的用户!');
    }
  }
  // 修改驾驶员信息
  updateDriver() {
    const driver  = {
      driverid : $('input[type= "checkbox"]:checked').parent().next().text() ,
      drivername : this.updateDrivername,
      driversex : this.updateDriversex,
      drivertelnumber : this.updateDrivertelnumber,
      driverbirthday : this.updateDriverBirthday,
      driveridentitynumber : this.updateDriveridentitynumber,
      drivermaritalstatus : this.updateDrivermaritalstatus,
      drivercompany : this.updateDrivercompany,
      driveracademic : this.updateDriveracademic,
      driverenglishskills : this.updateDriverenglishskills,
      drivernationality : this.updateDrivernationality,
    }
    // @ts-ignore
    if (this.test6 && this.test7 && this.test8 && this.test9 && this.test10 && this.test11 ) {
      this.http.post('api/Driver/updateDriver', null, {params: {driver: JSON.stringify(driver)}, responseType: 'text'})
        .subscribe(response => {
          alert(response);
          this.getData();
          this.modalRef.hide();
        });
    } else {
      this.condition = '请填写正确数据!';
    }
  }
  updatePicture() {
    const pattern = /^i.*?e/g;
    const dom = document.getElementById('file1');
    // @ts-ignore
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', dom.files[0]);
    formData.append('driverid', $('input[type="checkbox"]:checked').parent().next().text());
    const header = { ContentType: undefined};
    // @ts-ignore
    this.http.post('api/uploadPicture', null, {headers: header, params: formData}).subscribe(data => {
      alert('哈哈哈');
    });
   /* $.ajax({
      url: 'api/uploadPicture', async: true, type: 'POST', data: formData, contentType: false, processData: false,
      success(data) {
        if (pattern.exec(data)) {
          this.test11 = true;
          $('.picture').eq(1).find('img').attr('src', data);
          $('.condition').text('正在检测...');
        } else {
          this.test11 = false;
        }
      }
    });*/
  }
  // input框获取属性
  getInputClass(flag: boolean): string {
    if (flag) {
      return 'glyphicon glyphicon-ok form-control-feedback';
    } else {
      return 'glyphicon glyphicon-remove form-control-feedback';
    }
  }
  // input-group获取元素属性
  getInputGroupClass(flag: boolean): string {
    if (flag) {
      return 'input-group has-success';
    } else {
      return 'input-group has-error';
    }
  }
  // 检查驾驶员姓名
  checkDrivername() {
    const pattern = /[\u4e00-\u9fa5]{2,3}/g;
    if (this.drivername === '') {
      this.test1 = false;
      this.condition = '驾驶员姓名不能为空!';
    } else {
      this.condition = '正在检测...';
      if (pattern.exec(this.drivername) !== null) {
        this.test1 = true;
      } else {
        this.test1 = false;
        this.condition = '姓名必须是2-3位中文!';
      }
    }
  }
  // 检查编辑页面的信息是否合法
  checkupdateDrivername() {
    const pattern = /[\u4e00-\u9fa5]{2,3}/g;
    if (this.updateDrivername === '') {
      this.test6 = false;
      this.condition = '驾驶员姓名不能为空!';
    } else {
      this.condition = '正在检测...';
      if (pattern.exec(this.updateDrivername) !== null) {
        this.test6 = true;
      } else {
        this.test6 = false;
        this.condition = '姓名必须是2-3位中文!';
      }
    }
  }
  // 检查驾驶员电话号码
  checkDrivertelnumber() {
    const pattern = /^1+[3-8]+\d{9}/g;
    if (this.drivertelnumber === '') {
      this.test2 = false;
      this.condition = '驾驶员性电话号码不能为空!';
    } else {
      this.condition = '正在检测...';
      if (pattern.exec(this.drivertelnumber) !== null) {
        this.test2 = true;
      } else {
        this.test2 = false;
        this.condition = '电话号码格式不正确!';
      }
    }
  }
  // 检查编辑页面驾驶员电话号码
  checkUpdateDrivertelnumber() {
    const pattern = /^1+[3-8]+\d{9}/g;
    if (this.updateDrivertelnumber === '') {
      this.test7 = false;
      this.condition = '驾驶员性电话号码不能为空!';
    } else {
      this.condition = '正在检测...';
      if (pattern.exec(this.updateDrivertelnumber) !== null) {
        this.test7 = true;
      } else {
        this.test7 = false;
        this.condition = '电话号码格式不正确!';
      }
    }
  }
  // 检查驾驶员出生日期
  checkBirthday() {
    this.birthday = $('.birthday').val();
    const pattern = /\d{4}\-\d{2}\-\d{2}/g;
    this.condition = '正在检测...';
    if (pattern.exec(this.birthday) !== null) {
      this.test3 = true;
    } else {
      this.test3 = false;
      this.condition = '日期格式不正确!';
    }
  }
  // 检查编辑页面出生日期是否合法
  checkUpdateBirthday() {
    const pattern = /\d{4}\-\d{2}\-\d{2}/g;
    this.condition = '正在检测...';
    if (pattern.exec(this.updateDriverBirthday) !== null) {
      this.test8 = true;
    } else {
      this.test8 = false;
      this.condition = '日期格式不正确!';
    }
  }
  // 检查编辑页面身份证号是否合法
  checkUpdateDriveridentitynumber() {
    const pattern = /\d{18}/g;
    if (this.updateDriveridentitynumber === '') {
      this.test9 = false;
      this.condition = '驾驶员身份证号码不能为空!';
    } else {
      if (pattern.exec(this.updateDriveridentitynumber) !== null) {
        this.test9 = true;
      } else {
        this.test9 = false;
        this.condition = '身份证号必须是18位!';
      }
    }
  }
  // 检查驾驶员身份证号
  checkDriveridentitynumber() {
    const pattern = /\d{18}/g;
    if (this.driveridentitynumber === '') {
      this.test4 = false;
      this.condition = '驾驶员身份证号码不能为空!';
    } else {
      if (pattern.exec(this.driveridentitynumber) !== null) {
        this.test4 = true;
      } else {
        this.test4 = false;
        this.condition = '身份证号必须是18位!';
      }
    }
  }
  // 检查驾驶员所属公司
  checkDrivercompany() {
    if (typeof(this.drivercompany) === 'undefined' || this.drivercompany === '') {
      this.test5 = false;
      this.condition = '驾驶员所属公司不能为空!';
    } else {
      this.test5 = true;
      this.condition = '正在检测...';
    }
  }
  // 检查编辑页面驾驶员所属公司
  checkUpdateDrivercompany() {
    if (typeof(this.updateDrivercompany) === 'undefined' || this.updateDrivercompany === '') {
      this.test10 = false;
      this.condition = '驾驶员所属公司不能为空!';
    } else {
      this.test10 = true;
      this.condition = '正在检测...';
    }
  }
}
