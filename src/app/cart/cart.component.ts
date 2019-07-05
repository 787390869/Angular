import {AfterViewInit, Component, ElementRef, OnInit, TemplateRef} from '@angular/core';
import {CartService} from '../cart.service';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BsModalService, BsModalRef} from 'ngx-bootstrap';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  // 姓名检测正则
  namePattern = /[\u4e00-\u9fa5]{2,3}/i;
  // 电话号码检测正则
  telnumberPattern = /^1+[3-8]+\d{9}/i;
  // 身份证号检测正则
  identitynumberPattern = /\d{18}/i;
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
  driveracademic = '';
  // 驾驶员英语水平
  driverenglishskills = '';
  // 驾驶员国籍
  drivernationality = '';
  // 用户键入的需要模糊查询的电话
  userKeyupTelnumber;
  // 用户键入的需要模糊查询的驾驶员姓名
  userKeyupDrivername;
  // 数据Flag 1=>所有数据 2=>根据电话查询的数据 3=>根据姓名查找的数据
  dataFlag = 1;
  // 详情页驾驶员信息
  detailDriverid;
  detailDrivername;
  detailDriversex;
  detailDrivertelnumber;
  detailDriverbirthday;
  detailDrivermaritalstatus;
  detailDriveridentitynumber;
  detailDrivercompany;
  detailDriveracademic = '';
  detailDriverenglishskills = '';
  detailDrivernationality = '';
  detailsImage = '';
  // 存选中的checkbox的id
  checkboxList = [];
  // 新增驾驶员表单
  driverForm ;
  // 编辑驾驶员表单
  updateDriverForm;
  // 权限按钮
  ischecked = false;
  constructor(private route: ActivatedRoute, private http: HttpClient,
              private modalService: BsModalService , private formBuilder: FormBuilder) {
    // 构建新增驾驶员的表单模型
    this.driverForm = this.formBuilder.group({
      drivername: '',
      driversex: '',
      drivermaritalstatus: '',
      drivertelnumber: '',
      driverbirthday: '',
      driveridentitynumber: '',
      drivercompany: '',
      driveracademic: '',
      driverenglishskills: '',
      drivernationality: ''
    });
    // 构建编辑驾驶员的表单模型
    this.updateDriverForm = this.formBuilder.group({
      drivername: '',
      driversex: '',
      drivermaritalstatus: '',
      drivertelnumber: '',
      driverbirthday: '',
      driveridentitynumber: '',
      drivercompany: '',
      driveracademic: '',
      driverenglishskills: '',
      drivernationality: ''
    })
    // 开局绑定数据
    this.getData();
    this.http.get('api/Driver/getCountOfDriver').subscribe(data => {
      this.count = data;
      this.changePageLi();
    });
    // 查询当前登录用户
    this.http.get('api/User/getLoginUser').subscribe(data => {
      if (data !== null) {
        const response: any = data;
        const role = response.userRole.role;
        if (role !== 'admin') {
          this.ischecked = true;
        }
      }
    });
  }

  ngOnInit() {}
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
  // 分页数据的渲染
  getData() {
    this.http.get('api/Driver/getAllDriver/' + this.currentPage + '/' + this.size + '/' + this.sort).subscribe(data => {
      this.drivers = data;
    });
  }
  // 根据电话号码模糊查询渲染
  telnumberSerachRender() {
    if (this.currentPage > this.pageCount) {
      this.currentPage = 0;
    }
    this.dataFlag = 2;
    if (typeof(this.userKeyupTelnumber) === 'undefined') {
      this.userKeyupTelnumber = '';
    }
    const requestParam = {
      drivertelnumber: this.userKeyupTelnumber,
      page: this.currentPage,
      size: this.size
    }
    /*if (this.userKeyupDrivername)*/
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
    if (this.currentPage > this.pageCount) {
      this.currentPage = 0;
    }
    this.dataFlag = 3;
    if (typeof(this.userKeyupDrivername) === 'undefined') {
      this.userKeyupDrivername = '';
    }
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
      if (this.dataFlag === 2) {
        this.telnumberSerachRender();
      }
      if (this.dataFlag === 3) {
        this.drivernameSearchRender();
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
  // 改变每一页的数量
  changeSize(size) {
    this.size = size;
    this.getData();
    this.changePageLi();
  }
  // 选中复选框
  putCheckboxInList(e) {
    const driverid = e.target.parentElement.nextElementSibling.innerHTML;
    if (e.target.checked) {
      this.checkboxList.push(driverid);
    } else {
      for (let i = 0; i < this.checkboxList.length; i++) {
        if (this.checkboxList[i] === driverid) {
          this.checkboxList.splice(i, 1);
        }
      }
    }
  }
  // 新增驾驶员
  addDriver() {
    this.http.get('api/Driver/addDriver',
      {params: {driver: JSON.stringify(this.driverForm.value), imgSrc: document.getElementById('imagesrc').getAttribute('src')}})
      .subscribe(data => {
        const response: any = data;
        alert(response.back);
        this.modalRef.hide();
      });
  }
  // 删除驾驶员
  deleteDriver() {
    if (this.checkboxList.length === 0) {
      alert('请选择需要删除的驾驶员!');
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.checkboxList.length ; i++) {
        this.http.get('api/Driver/deleteDriverById/' + this.checkboxList[i]).subscribe(data => {
          const respose: any = data;
          alert(respose.back);
          this.getData();
          this.checkboxList = [];
        });
      }
    }
  }
  // 打开大号新增框
  openBigModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, {class: 'gray modal-lg'}));
  }
  // 打开大号编辑框
  openUpdateModal(template: TemplateRef<any>) {
    if (this.checkboxList.length === 1) {
      this.modalRef = this.modalService.show(template,
        Object.assign({}, {class: 'gray modal-lg'}));
      this.http.get('api/Driver/findDriverById/' + this.checkboxList[0]).subscribe(response => {
        const data: any = response;
        console.log(data);
        this.updateDriverForm.patchValue({drivername: data.drivername});
        this.updateDriverForm.patchValue({driversex: data.driversex});
        this.updateDriverForm.patchValue({drivertelnumber: data.drivertelnumber});
        this.updateDriverForm.patchValue({driverbirthday: data.driverbirthday});
        this.updateDriverForm.patchValue({driveridentitynumber: data.driveridentitynumber});
        this.updateDriverForm.patchValue({drivernationality: data.drivernationality});
        this.updateDriverForm.patchValue({drivercompany: data.drivercompany});
        this.updateDriverForm.patchValue({driveracademic: data.driveracademic});
        this.updateDriverForm.patchValue({driverenglishskills: data.driverenglishskills});
        this.updateDriverForm.patchValue({drivermaritalstatus: data.drivermaritalstatus});
        document.getElementById('imagesrc2').setAttribute('src', data.driverimage);
      });
    } else {
      alert('请选中一个需要编辑的用户!');
    }
  }
  //  打开详情框
  openDetailModal(template: TemplateRef<any>, e) {
    const id = e.target.previousElementSibling.innerHTML;
    const requestParam = {
      driverid: id
    }
    this.http.get('api/Driver/getDetailDriver', {params: requestParam}).subscribe(response => {
      const data: any = response;
      this.modalRef = this.modalService.show(template);
      console.log(data);
      this.detailDrivername = data.drivername;
      this.detailDriversex = data.driversex;
      this.detailDrivertelnumber = data.drivertelnumber;
      this.detailDriverbirthday = data.driverbirthday;
      this.detailDriveridentitynumber = data.driveridentitynumber;
      this.detailDrivernationality = data.drivernationality;
      this.detailDrivercompany = data.drivercompany;
      this.detailDriveracademic = data.driveracademic;
      this.detailDriverenglishskills = data.driverenglishskills;
      this.detailsImage = data.driverimage;
      this.detailDrivermaritalstatus = data.drivermaritalstatus;
      this.detailDriverid = data.driverid;
    });
  }
  // 修改驾驶员信息
  updateDriver1() {
    this.http.post('api/Driver/updateDriver', null,
      {params: {driver: JSON.stringify(this.updateDriverForm.value), imgSrc: document.getElementById('imagesrc2').getAttribute('src'),
          driverid: this.checkboxList[0]}, responseType: 'text'
      })
      .subscribe(data => {
        alert(data);
        this.getData();
        this.modalRef.hide();
        this.checkboxList = [];
      });
  }
  // jquery: ajax异步上传图片, angular:httpclient上传,不知道怎么做
  updatePicture() {
    const pattern = /^i.*?e/g;
    const dom = document.getElementById('image2');
    // @ts-ignore
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', dom.files[0]);
    formData.append('driverid', this.checkboxList[0]);
    /*const header = { ContentType: undefined};
    // @ts-ignore
    this.http.post('api/uploadPicture', null, {headers: header, params: formData}).subscribe(data => {
      alert('哈哈哈');
    });*/
    $.ajax({
      url: 'api/uploadPicture', async: true, type: 'POST', data: formData, contentType: false, processData: false,
      success(data) {
        if (pattern.exec(data)) {
          $('#imagesrc2').attr('src', data);
        } else {
          alert(data);
        }
      }
    });
  }
  // 新增驾驶员上传图片
  addUploadPicture() {
    let driverid = '';
    $.ajax({
      url: 'api/Driver/maxOfDriver', dataType: 'text', type: 'GET', async: false,
      success(data) {
        driverid = data;
      }
    });
    const pattern = /^i.*?e/g;
    const dom = document.getElementById('image');
    // @ts-ignore
    const img = dom.files[0];
    const formdata = new FormData();
    formdata.append('file', img);
    formdata.append('driverid', driverid);
    $.ajax({
      url: 'api/uploadPicture', async: true, type: 'POST', data: formdata, contentType: false, processData: false,
      success(data) {
        if (pattern.exec(data)) {
          $('#imagesrc').attr('src', data);
        } else {
          alert(data);
        }
      }
    });
  }
}
