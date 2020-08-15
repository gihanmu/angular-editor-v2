import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Url } from '../util/util';
import { stringify } from 'querystring';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {

  registerForm: FormGroup;
  contentForm: FormGroup;
  kendoEditorForm: FormGroup;
  submitted = false;

  // libraries = ['', 'Boilerpipe', 'BoilerPy3', 'Readability', 'Readability+BeautifulSoup'];
  libraries = ['', 'Readability', 'Boilerpipe', 'Newspaper'];
  noExtractors = ['N/A'];
  boilerpipeExtractors = ['', 'Default Extractor', 'Article Extractor', 'Largest Content Extractor', 'Keep Everything Extractor'];
  // boilerPy3Extractors = ['', 'Default Extractor', 'Article Extractor', 'Article Sentences Extractor', 'Largest Content Extractor', 'Canola Extractor', 'Keep Everything Extractor', 'Num Words Rules Extractor'];
  // outputFormats = ['', 'HTML', 'HTML Fragment', 'Text', 'JSON'];
  outputFormats = ['']
  readabilityOutputFormats = ['HTML'];
  boilerpipeOutputFormats = ['', 'HTML', 'HTML Fragment', 'Text', 'JSON'];
  newspaperOutputFormats = ['HTML', 'Text'];

  extractors = this.noExtractors;

  title = '';
  content = '';
  displayDataExtraction = true;
  displayEditor = false;
  displaySuccessTranfer = false;
  createdItem = '';
  tranferError = '';
  transferMessage = '';

  url = "";
  library = "";
  extractor = "";
  outputFormat = "";

  //CreateCourse Dialog
  public createCourseOpened = false;
  public dataSaved = false;
  public courseCategories: Observable<any> = of(
    ['Cateogry 1', 'Category 2']
  );
  public courseToCreate = {
    name: '',
    shortName: '',
    category: '',
    id: ''
  };

  constructor(private formBuilder: FormBuilder) { }

  valueChange(e: string) {
    this.content = e;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      url: ['http://techblogs/uxx/?p=7454', [Validators.required]],
      library: ['Readability', Validators.required],
      extractor: ['N/A', Validators.required],
      outputFormat: ['HTML', Validators.required],
    });
    this.contentForm = this.formBuilder.group({
      title: ['', [Validators.required]],
    });
    this.kendoEditorForm = this.formBuilder.group({
      kendoEditor: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get regForm() { return this.registerForm.controls; }

  // get contForm() { return this.contForm.controls; }

  async postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async postDataParams(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      // headers: {
      //   'Content-Type': 'application/json'
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      // },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data)// body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  onLibraryChange() {
    switch (this.registerForm.controls['library'].value) {
      case 'Readability':
        this.extractors = this.noExtractors;
        this.outputFormats = this.readabilityOutputFormats;
        this.registerForm.controls['extractor'].setValue(this.extractors[0]);
        this.registerForm.controls['outputFormat'].setValue(this.outputFormats[0]);
        break;

      case 'Boilerpipe':
        this.extractors = this.boilerpipeExtractors;
        this.outputFormats = this.boilerpipeOutputFormats;
        this.registerForm.controls['extractor'].setValue(this.extractors[1]);
        // this.registerForm.controls['outputFormat'].setValue(this.outputFormats[1]);
        break;

      case 'Newspaper':
        this.extractors = this.noExtractors;
        this.outputFormats = this.newspaperOutputFormats;
        this.registerForm.controls['extractor'].setValue(this.extractors[0]);
        this.registerForm.controls['outputFormat'].setValue(this.outputFormats[0]);
        break;

      // case 'BoilerPy3':
      //   this.extractors = this.boilerPy3Extractors;
      //   this.registerForm.controls['extractor'].setValue(this.extractors[1]);
      //   break;

      case '':
        this.extractors = [];
        break;

      default:
        break;
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    // if (this.registerForm.invalid) {
    //   return;
    // }

    this.url = this.registerForm.controls['url'].value;
    this.library = this.registerForm.controls['library'].value;
    this.extractor = this.registerForm.controls['extractor'].value;
    this.outputFormat = this.registerForm.controls['outputFormat'].value;


    this.postData(environment.extractorEndPoint, {
      "url": this.url,
      "library": this.library,
      "extractor": this.extractor,
      "outputformat": this.outputFormat
    }).then(res => {
      // Adding Library and extractor to the title
      if (this.extractor != "" && this.extractor != "N/A") {
        this.title = res.title + " : (" + this.library + " - " + this.extractor + ")";
      }
      else {
        this.title = res.title + " : (" + this.library + ")";
      }

      this.contentForm.controls['title'].setValue(this.title);
      this.kendoEditorForm.controls['kendoEditor'].setValue(res.content);
      this.content = res.content;
      this.displayEditor = true;
      this.displayDataExtraction = false;
      this.displaySuccessTranfer = false;
      // this.kendoEditorForm.controls['kendoEditor'].updateValueAndValidity({ onlySelf: true, emitEvent: true });
    }).finally(() => {
      this.displayEditor = true;
      this.displayDataExtraction = false;
      this.displaySuccessTranfer = false;
    });
    // this.valueChange(this.kendoEditorForm.controls['kendoEditor'].value);
  }

  onClickBack(step: number) {
    if (step == 0) {
      this.displayDataExtraction = true;
      this.displayEditor = false;
      this.displaySuccessTranfer = false;
      this.transferMessage = '';
      this.createdItem = '';
    } else if (step == 1) {
      this.displayDataExtraction = false;
      this.displayEditor = true;
      this.displaySuccessTranfer = false;
      this.transferMessage = '';
      this.createdItem = '';
    }
  }

  onClickCreateCourse() {
    this.createCourseOpened = true;
    // TODO: To be replaced from the input from front end
    // let courseName = "DEMO Course 2"
    // let courseShortName = "DEMO 2"
    // let courseIdNumber = 2
    // this.createdItem = "Course";
    // this.createCourse(courseName, courseShortName, environment.moodleWsCourseCategoryId, courseIdNumber);
  }

  onClickAddDiscussion() {
    this.createdItem = "Forum Discussion";
    this.addDiscussion();
  }

  onClickAddDiscussionPost() {
    this.createdItem = "Discussion Post";
    this.addDiscussionPost();
  }

  // onClickAddNewWikiPage() {
  // this.createdItem = "New Wiki Page";

  // }

  // onClickAddContentToWikiPage() {
  // this.createdItem = "Wiki page content";

  // }

  createCourse(courseName: string, courseShortName: string, courseCategoryId: number, courseIdNumber: number) {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncCreateCourse);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][fullname]", encodeURIComponent(courseName));
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][shortname]", encodeURIComponent(courseShortName));
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][categoryid]", courseCategoryId);
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][idnumber]", courseIdNumber);

    this.postDataParams(apiCallUrl).then(res => {
      if (res.exception) {
        this.tranferError = res.message;
        this.transferMessage = res.exception + ' - ' + res.errorcode + ' - ' + res.message;
      }
      else if (res[0]) {
        this.tranferError = ''
        this.transferMessage = 'New Course: ' + res[0].id + ' with Short name ' + res[0].shortname + 'has been successfully created...!';
      }
      this.displaySuccessTranfer = true;
      this.displayEditor = false;
      this.displayDataExtraction = false;
    });
  }

  addDiscussion() {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncForumAddDiscussion);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
    // TODO: To be replaced from the input from front end
    apiCallUrl = Url.addParam(apiCallUrl, "forumid", environment.moodleWsForumId);
    apiCallUrl = Url.addParam(apiCallUrl, "subject", encodeURIComponent(this.title));
    apiCallUrl = Url.addParam(apiCallUrl, "message", encodeURIComponent(this.content));

    this.postDataParams(apiCallUrl).then(res => {
      if (res.exception) {
        this.tranferError = res.message;
        this.transferMessage = res.exception + ' - ' + res.errorcode + ' - ' + res.message;
      }
      else if (res) {
        this.tranferError = ''
        this.transferMessage = 'Forum Discussion: ' + res.discussionid + ' has been successfully added...!';
      }
      this.displaySuccessTranfer = true;
      this.displayEditor = false;
      this.displayDataExtraction = false;
    });
  }

addDiscussionPost() {
  let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
  apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncForumAddDiscussionPost);
  apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
  apiCallUrl = Url.addParam(apiCallUrl, "postid", environment.moodleWsDiscussionId);
  // TODO: To be replaced from the input from front end
  apiCallUrl = Url.addParam(apiCallUrl, "subject", encodeURIComponent('DEMO Forum Discussion Post'));
  apiCallUrl = Url.addParam(apiCallUrl, "message", encodeURIComponent(this.content));

  this.postDataParams(apiCallUrl).then(res => {
    if (res.exception) {
      this.tranferError = res.message;
      this.transferMessage = res.exception + ' - ' + res.errorcode + ' - ' + res.message;
    }
    else if (res) {
      this.tranferError = ''
      this.transferMessage = 'Forum Discussion post: ' + res.postid + ' has been successfully added...!';
    }
    this.displaySuccessTranfer = true;
    this.displayEditor = false;
    this.displayDataExtraction = false;
  });
}

  public onCreateCourseDialogClose() {
    this.createCourseOpened = false;
    const {name, shortName, category, id} = this.courseToCreate;
    this.createCourse(name, shortName, environment.moodleWsCourseCategoryId, parseInt(id));

}

    public onCreateCourseDialogOpen() {
        this.createCourseOpened = true;
    }

  public submit() {
      this.dataSaved = true;
      this.onCreateCourseDialogClose();
  }
}

