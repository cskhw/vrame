import type { DrawingData } from "@/types/case";
import { errorMessages } from "@/api/error";
import { buttonText } from "@/assets/javascripts/data";
import pluralize from "pluralize";
import { ONE_MB, ONE_KB } from "@/assets/javascripts/common";

/* method list

getDate             오늘 날짜를 2022-03-07 형태로 반환
getTimeStamp        현재 시간을 23:15:123 형태로 반환
replaceAll          일치하는 text 모두 변환
cutString           원하는 위치에서 말줄임표를 붙여줌
checkValidity       유효성(null, undefined, length) 체크
checkFileSize       파일 1개의 크기 체크(바이트 단위)
checkUploadFilesSize   파일 한개 혹은 여러개의 크기 체크(바이트 단위)
checkFileTypes       주어진 파일의 확장자 체크
logger              시간을 붙여서 로그 찍음
setJosa             구성요소 명칭과, 현재 사용된 조사를 던져주면, 그에 대응되는 종성에 맞는 정상 조사 반환
toJPHalfWidth       알파벳, 숫자 일본어 반각 전환
toJPFullWidth       알파벳, 숫자 일본어 전각 전환

openInfoModal       Information 모달 표시
openAlertModal      Alert 모달 표시
getI18NTxt          키값에 맞는 언어 텍스트 리턴(서버에서 가져온 데이터 사용, appStore.lang 사용)
getLocaleTxt        draft 홈에서 키값에 맞는 언어 텍스트 리턴(vue i18n 라이브러리 사용)
getUserName         사용자 이름 리턴
getTimeZone         사용하는 시간대 가져오기
getColor            키값에 맞는 테마 코드 색상 리턴
getSettingValue     사용자의 환경설정값 가져오기
getIdiomData        관용어구값 가져오기
// getLocaleTimeFromTo       From의 시간 String을 To의 시간으로
// getTimeFromTo       From의 시간 String을 To의 시간 객체로
getUserTime         UTC 시간을 사용자의 timezone 시간 객체로
getDateTimeByFormat 날짜+시간을 원하는 포맷으로 변환해서 반환
getDateFormat       서비스 유형(Format)에 따라 대응되는 국가의 날짜 표시 양식을 반환
getDateDiff         날짜 차이 계산해서 반환
getAddCommaString   숫자에 세 자리 마다 컴마 추가해서 반환

dataURItoBlob       dataURI를 Blob로 변환
dataURLtoFile       dataURI를 File로 변환
getThumbImgFile     이미지 썸네일 생성
getCodeFromLang     언어 약자에 맞는 코드를 반환
getCodeFromLang     언어 약자에 맞는 코드를 반환


*/

// 자동완성 태그 포맷
/*
  tagId -> 자동완성 태그 삽입/핸들링을 위한 tagID
  elementName -> 구성요소 명칭. 한글 조사 자동 변경을 위해 사용
  elementId -> 구성요소 고유의 ID
  firstCharacterCapital -> 첫글자가 자동으로 대문자로 변경되었는지 여부. USPTO 등에서 사용
  changePlural -> 단복수 변경여부. USPTO 등에서 사용
  autocompeleteColor -> 자동완성 텍스트 색상
  autocompeleteWeight -> 자동완성 텍스트 굵기
  autocompleteText -> 자동완성 텍스트
*/
// const autocompleteFormat =
//   '<span id="{tagID}" data-name="{elementName}" data-number="{elementNumber}" data-eid="{elementId}" data-fcc="{firstCharacterCapital}" data-cp="{changePlural}" class="autocomplete {elementId}" contentEditable="false" style="color: {autocompeleteColor}; font-weight: {autocompeleteWeight}">{autocompleteText}</span>';

const autocompleteFormat =
  '<span id="{tagID}" data-name="{elementName}" data-number="{elementNumber}" data-eid="{elementId}" data-fcc="{firstCharacterCapital}" data-cp="{changePlural}" class="autocomplete {elementId}" contentEditable="false">{autocompleteText}</span>';

// 한글 조사 변환용 배열(받침 있는 경우)
const jongJosa = [
  "은",
  "을",
  "이",
  "과",
  "으로",
  "으로서",
  "으로써",
  "으로부터",
  "으로는",
];
// 한글 조사 변환용 배열(받침 없는 경우)
const notJongJosa = [
  "는",
  "를",
  "가",
  "와",
  "로",
  "로서",
  "로써",
  "로부터",
  "로는",
];
// 한글 조사 변환용 배열(ㄹ받침일 때 잘못 쓰는 경우)
const liulJosa = [
  "은",
  "을",
  "이",
  "과",
  "로",
  "로서",
  "로써",
  "로부터",
  "로는",
];
// 한글 조사 변환용 배열(ㄹ받침일 때 잘못 쓰는 경우)
const notLiulJosa = [
  "는",
  "를",
  "가",
  "와",
  "으로",
  "으로서",
  "으로써",
  "으로부터",
  "으로부터",
];

// 설명:            오늘 날짜를 2022-03-07 형태로 반환
// Arguement:       -
// Return:          2022-03-07 형식의 날짜
export function getDate(): string {
  const date = new Date();
  const year = date.getFullYear(); //yyyy
  let month: number | string = 1 + date.getMonth();
  month = month >= 10 ? month.toString() : "0" + month; //month 두자리로 저장
  let day: number | string = date.getDate(); //d
  day = day >= 10 ? day : "0" + day; //day 두자리로 저장
  return year + "-" + month + "-" + day;
}

// 설명:            현재 시간을 23:15:123 형태로 반환
// Arguement:       -
// Return:          23:15:123 형식의 현재 시간
export function getTimeStamp() {
  const date = new Date();
  const hours = date.getHours(); // 시
  const minutes = date.getMinutes(); // 분
  const seconds = date.getSeconds(); // 초
  const milliseconds = date.getMilliseconds(); // 밀리초

  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0") +
    ":" +
    milliseconds.toString().padStart(3, "0")
  );
}

// 설명:            일치하는 text 모두 변환
// Arguement:       str -> 원본 text, searchStr -> 변경 전 text, replaceStr -> 변경 후 text
// Return:          replaceStr로 모두 변경된 text
export function replaceAll(str: string, searchStr: string, replaceStr: string) {
  return str.split(searchStr).join(replaceStr);
}

// 설명:            원하는 위치에서 말줄임표를 붙여줌
// Arguement:       str -> 원본 text, limit -> 말줄임표를 붙일 제한
// Return:          설정된 글자수로 잘린 후 ...가 붙은 text
export function cutString(str: string, limit: number) {
  let strLength = 0;
  let strTitle = "";
  let strPiece = "";

  for (let i = 0; i < str?.length; i++) {
    const code = str.charCodeAt(i);
    const ch = str.substr(i, 1).toUpperCase();
    strPiece = str.substr(i, 1);
    if (
      (ch < "0" || ch > "9") &&
      (ch < "A" || ch > "Z") &&
      (code > 255 || code < 0)
    ) {
      strLength = strLength + 3; //UTF-8 3byte 로 계산
    } else {
      strLength = strLength + 1;
    }

    if (strLength > limit) {
      //제한 길이 확인
      strTitle = strTitle + "…";
      break;
    } else {
      strTitle = strTitle + strPiece; //제한길이 보다 작으면 자른 문자를 붙여준다.
    }
  }

  return strTitle;
}

// 설명:            유효성(null, undefined, length) 체크
// Arguement:       data -> 검사 대상
// Return:          true -> 유효함, false -> 못써먹음
export function checkValidity(data: any) {
  if (data == null || data == undefined || data.length == 0) return false;
  else return true;
}

// 설명:            파일 용량 체크
// Arguement:       file -> 검사 대상
// Return:          true -> 유효함, false -> 못써먹음
export function checkFileSize(file: File, limitSize: number) {
  // 파일 사이즈가 제한보다 크면 true 아니면 false
  return file.size < limitSize;
}

// 설명:            전체 파일 용량 체크
// Arguement:       files -> 검사 대상, flag -> 개별 파일 검사 유무, checkFunc -> 개별 파일 검사일 때 실행할 함수
// Return:          true -> 유효함, false -> 못써먹음
export function checkUploadFilesSize(
  files: File[] | DrawingData[],
  limitSize: number,
  limitAllSize: number,
  allCheckFunc?: () => void,
  flag?: boolean,
  checkFunc?: () => void
) {
  let allFileSize = 0;
  for (const file of files) {
    if (flag && !checkFileSize(file, limitSize)) {
      if (checkFunc) checkFunc();
      return false;
    }
    allFileSize += file.size;
  }
  // 파일 사이즈가 제한보다 크면ALL_FILES_SIZE_LIMIT
  if (allFileSize < limitAllSize) return true;
  else {
    if (allCheckFunc) allCheckFunc();
    return false;
  }
}

// 설명:            파일 타입 체크
// Arguement:       file -> 검사 대상, types -> 검사할 확장자들
// Return:          true -> 유효함, false -> 못써먹음
export function checkFileTypes(fileType: string, types: string[]): boolean {
  let flag = false;
  types.forEach((type) => {
    if (fileType.includes(type)) flag = true;
  });
  return flag;
}

// 설명:            시간을 붙여서 로그 찍음
// Arguement:       data -> 로그 내용
// Return:          -
export function logger(...args: any[]) {
  console.log(getTimeStamp(), "---->", args);
}

// 설명:            구성요소 명칭과, 현재 사용된 조사를 던져주면, 그에 대응되는 종성에 맞는 정상 조사 반환
// Arguement:       checkTxt -> 종성이 있는지 체크할 문자, josaTxt -> 현재의 조사
// Return:          정상 조사

export function setJosa(checkTxt: string, josaTxt: string) {
  checkTxt = checkTxt + "";
  // 한글, 숫자, 알파벳 발음에 종성이 있는가?
  const hasFinal =
    (/[가-힣]$/.test(checkTxt) &&
      (checkTxt.substr(-1).charCodeAt(0) - 0xac00) % 28 > 0) ||
    /[가-힣]\d*[013678]$/.test(checkTxt) ||
    /[a-z]\d*[1789]$/i.test(checkTxt) ||
    /[013678]$/.test(checkTxt) || // 원래 소스에서 추가함. 숫자만 있는 것 조사 체크
    /([clmnp]|[blnt](e)|[co](k)|[aeiou](t)|mb|ng|lert)$/i.test(checkTxt);

  // console.log(checkTxt, josaTxt, hasFinal);

  // 받침이 있는 경우
  if (hasFinal) {
    // 받침이 'ㄹ'로 끝난 경우
    // if ((checkTxt.substr(-1).charCodeAt(0) - 0xac00) % 28 == 8) { // 기존 소스. 1, 7, 8 리을로 끝나는것 때문에 아래 추가
    if (
      (checkTxt.substr(-1).charCodeAt(0) - 0xac00) % 28 == 8 ||
      checkTxt.substr(-1) === "1" ||
      checkTxt.substr(-1) === "7" ||
      checkTxt.substr(-1) === "8"
    ) {
      //조사가 잘못 쓰인 상황으로, 대응되는 조사 반환
      if (notLiulJosa.indexOf(josaTxt) > -1)
        return liulJosa[notLiulJosa.indexOf(josaTxt)];
      //조사가 정상적으로 쓰인 상황이거나, 매칭되는 조사가 없는 경우
      else return josaTxt;
    }
    // 받침이 'ㄹ'이 아닌 경우
    else {
      //조사가 잘못 쓰인 상황으로, 대응되는 조사 반환
      if (notJongJosa.indexOf(josaTxt) > -1)
        return jongJosa[notJongJosa.indexOf(josaTxt)];
      //조사가 정상적으로 쓰인 상황이거나, 매칭되는 조사가 없는 경우
      else return josaTxt;
    }
  }
  // 받침이 없는 경우
  else {
    //조사가 잘못 쓰인 상황으로, 대응되는 조사 반환
    if (jongJosa.indexOf(josaTxt) > -1)
      return notJongJosa[jongJosa.indexOf(josaTxt)];
    //조사가 정상적으로 쓰인 상황이거나, 매칭되는 조사가 없는 경우
    else return josaTxt;
  }
}

// 설명:            알파벳, 숫자 일본어 반각 전환
// Arguement:       jpTxt -> 변환하고자 하는 텍스트
// Return:          반각으로 전환된 텍스트
export function toJPHalfWidth(jpTxt: any) {
  //숫자인 경우 문자로 변환
  jpTxt = jpTxt + "";
  return jpTxt.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s: any) {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
}

// 설명:            알파벳, 숫자 일본어 전각 전환
// Arguement:       jpTxt -> 변환하고자 하는 텍스트
// Return:          전각으로 전환된 텍스트
export function toJPFullWidth(jpTxt: any) {
  //숫자인 경우 문자로 변환
  jpTxt = jpTxt + "";
  return jpTxt.replace(/[A-Za-z0-9]/g, function (s: any) {
    return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
  });
}

// 설명:            첫글자를 대문자로 변환
// Arguement:       originalTxt -> 변환하고자 하는 텍스트
// Return:          첫글자가 대문자로 변환된 텍스트
export function makeFirstCharacterUpperCase(originalTxt: string) {
  // 영어 알파벳인지 체크용 정규식
  const EN_pattern = /[a-zA-Z]/;

  if (checkValidity(originalTxt) && EN_pattern.test(originalTxt[0]))
    return (
      originalTxt.slice(0, 0) +
      originalTxt[0].toUpperCase() +
      originalTxt.slice(1)
    );
  else return originalTxt;
}

// 설명:            객체 배열을 key, order로 정렬, key값은 String
// Arguement:       targetArray -> 정렬 대상, key -> 정렬기준, type -> key에 들어 있는 데이터의 종류(string / number), order -> "ASC": 오름차순, "DESC": 내림차순
// Return:          정렬된 배열
export function sortObjectArray(
  targetArray: any[],
  key: string,
  type: any,
  order: string
) {
  if (type.toLowerCase() == "string") {
    if (order.toLowerCase() == "asc") {
      targetArray.sort(function (a: any, b: any) {
        // 태그 모두 제거하고 비교
        const x = a[key].toLowerCase().replace(/(<([^>]+)>)/gi, "");
        const y = b[key].toLowerCase().replace(/(<([^>]+)>)/gi, "");
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
    } else {
      targetArray.sort(function (b: any, a: any) {
        // 태그 모두 제거하고 비교
        const x = a[key].toLowerCase().replace(/(<([^>]+)>)/gi, "");
        const y = b[key].toLowerCase().replace(/(<([^>]+)>)/gi, "");
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
    }
  } else if (type.toLowerCase() == "number") {
    if (order.toLowerCase() == "asc") {
      targetArray.sort(function (a: any, b: any) {
        return a[key] - b[key];
      });
    } else {
      targetArray.sort(function (b: any, a: any) {
        return a[key] - b[key];
      });
    }
  }

  // targetArray.forEach ((item) => {
  //     console.log(item[key])
  // })

  // console.log(targetArray);
}

// 설명:            구성요소 자동완성 태그 생성
// Arguement:       element -> 구성요소 항목, format -> 유형, autocomplete_type -> 자동완성 유형, tagID -> 해당 태그의 고유 key,
//                  isShiftKey -> shitfkey 눌렸는지 여부, isFirstWordInSentence -> 문장의 처음인지 여부
// Return:          자동완성 태그
export function makeAutocompleteTag(
  element: any,
  format: string,
  autocomplete_type: string,
  tagID: string,
  isShiftKey: boolean,
  isFirstWordInSentence: boolean
) {
  // 자동완성될 텍스트
  let autocompleteTxt = "";
  // 해당 태그의 첫글자가 자동으로 대문자로 변경되었는지 여부
  let firstCharacterCapital = "F";
  // 해당 태그의 자동완성 텍스트의 단복수 상태가 전환되었는지 여부
  let changePlural = "F";

  // USPTO 이고 shift키가 눌려 있으면 단복수 전환한 것으로 자동완성 텍스트 생성
  if (format == "FORMAT/USPTO" && isShiftKey == true) {
    autocompleteTxt = makeAutocompleteTxt(
      element,
      format,
      autocomplete_type,
      true
    );
    changePlural = "T";
  } else {
    autocompleteTxt = makeAutocompleteTxt(
      element,
      format,
      autocomplete_type,
      false
    );
  }

  // USPTO이고, 문장의 첫단어이면, 첫글자를 대문자로 변환해줌
  if (format == "FORMAT/USPTO" && isFirstWordInSentence) {
    autocompleteTxt = makeFirstCharacterUpperCase(autocompleteTxt);
    firstCharacterCapital = "T";
  }

  // 자동완성 태그 반환
  return autocompleteFormat
    .replace("{autocompleteText}", autocompleteTxt)
    .replace("{tagID}", tagID)
    .replace("{elementName}", element.name.replace(/<(\/?)p>/gi, ""))
    .replace("{elementNumber}", element.number.replace(/<(\/?)p>/gi, ""))
    .replace(/{elementId}/gi, element.elementId)
    .replace("{firstCharacterCapital}", firstCharacterCapital)
    .replace("{changePlural}", changePlural);
}

// 설명: 구성요소 자동완성 텍스트 생성
// Arguement: element -> 구성요소 항목, format -> 유형, autocomplete_type -> 자동완성 유형, changePlural -> 단복수 전환 여부
// Return: 자동완성 태그
export function makeAutocompleteTxt(
  element: any,
  format: string,
  autocompleteType: string,
  changePlural: boolean
) {
  /*
    element: {
        "name": 구성요소 명칭,
        "number": 구성요소 번호
    }
        
    autocomplete_type:
        TYPE1	본체(100)
        TYPE2	본체 (100)
        TYPE3	본체100
        TYPE4	본체 100
*/
  let autocompleteTxt = "";

  // tiny를 통해 데이터가 저장될 때, 앞뒤에 p태그가 붙어 있어서 제거해줌
  let elementName = element.name.trim().replace(/<(\/?)p>/gi, "");
  const elementNumber = element.number.trim().replace(/<(\/?)p>/gi, "");
  // USPTO인 경우 자동완성 태그를 삽입하는 순간에 shiftKey가 동시에 눌려져 있는 상태이면 단복수 상태를 전환해서 넣어줌
  // 본 method는 자동완성 패널에 표시될 데이터를 셋팅하는 데에도 사용되나, 이때에는 shiftKey가 눌려져 있지 않을 것임
  // 알파벳을 쓰는 다른 유형인 경우에도 적용될 수 있음
  if (format == "FORMAT/USPTO" && changePlural == true) {
    if (pluralize.isPlural(elementName) == true) {
      // console.log("복수인데 단수로 넣는다");
      elementName = pluralize.singular(elementName);
    } else {
      // console.log("단수인데 복수로 넣는다");
      elementName = pluralize.plural(elementName);
    }
  }

  /****** 나중에 CNIPA(중국) 추가되면 JPO처럼 분기 태워야할 수 있음. */
  if (format != "FORMAT/JPO") {
    if (elementNumber.trim() == "" || elementNumber == "000")
      autocompleteTxt = elementName;
    else if (autocompleteType == "TYPE1")
      autocompleteTxt = elementName + "(" + elementNumber + ")";
    else if (autocompleteType == "TYPE2")
      autocompleteTxt = elementName + " (" + elementNumber + ")";
    else if (autocompleteType == "TYPE3")
      autocompleteTxt = elementName + elementNumber;
    else if (autocompleteType == "TYPE4")
      autocompleteTxt = elementName + " " + elementNumber;
  } else {
    if (
      elementNumber.replace("　", "").trim() == "" ||
      elementNumber == "０００"
    )
      autocompleteTxt = elementName;
    else if (autocompleteType == "TYPE1")
      autocompleteTxt = elementName + "（" + elementNumber + "）";
    else if (autocompleteType == "TYPE2")
      autocompleteTxt = elementName + "　（" + elementNumber + "）";
    else if (autocompleteType == "TYPE3")
      autocompleteTxt = elementName + elementNumber;
    else if (autocompleteType == "TYPE4")
      autocompleteTxt = elementName + "　" + elementNumber;
  }

  return autocompleteTxt;
}

// 설명:            구성요소 자동완성 태그 생성
// Arguement:       element -> 구성요소 항목, format -> 유형, autocompleteType -> 자동완성 유형, autocompeleteColor -> 자동완성 색상, autocompeleteWeight -> 자동완성 굵기
// Return:          자동완성 태그
export function setUpTitleInIdiom(
  stores: any,
  format: string,
  idiomText: string
) {
  const elementList = stores.ws.caseData.elements.list;
  try {
    // 발명의 명칭에 대응되는 구성요소 추출
    const titleElement = elementList.filter(function (data: any) {
      return data.inputOrder === 0;
    });

    // 명칭 구성요소가 안튀어나왔으면 그냥 리턴
    if (titleElement.length < 1) return "";

    // 자동완성 태그에 사용할 tagID. 고유해야 하므로 랜덤값을 추가해줌. 태그가 들어갈때마다 생성해야 함
    let tagID = "";

    // KIPO인 경우 조사 변경
    if (format == "FORMAT/KIPO") {
      const textArray = idiomText.split(" ");
      textArray.forEach((item) => {
        if (item.indexOf("[TITLE]") >= 0) {
          const currentJosa = item.substring(
            item.indexOf("[TITLE]") + 7,
            item.length
          );
          // console.log(
          //   "|" + titleElement[0].name.replace(/<(\/?)p>/gi, "") + "|",
          //   "|" + currentJosa + "|"
          // );
          const rightJosa = setJosa(
            titleElement[0].name.replace(/<(\/?)p>/gi, ""),
            currentJosa
          );
          // console.log(rightJosa);
          tagID =
            titleElement[0].elementId +
            "-" +
            getTimeStamp() +
            "-" +
            Math.random().toString(36).substring(2, 11);
          idiomText = idiomText.replace(
            "[TITLE]" + currentJosa,
            makeAutocompleteTag(
              titleElement[0],
              format,
              getSettingValue(stores, "SETTING/EDITOR/AUTOCOMPLETE_FORMAT"),
              tagID,
              false,
              false
            ) + rightJosa
          );
        }
      });
    }

    // USPTO인 경우 첫글자 대문자로
    if (format == "FORMAT/USPTO") {
      // 구두점 뒤 띄어쓰기 2개까지 대응
      tagID =
        titleElement[0].elementId +
        "-" +
        getTimeStamp() +
        "-" +
        Math.random().toString(36).substring(2, 11);
      idiomText = idiomText.replace(
        /. {2}\[TITLE\]/gi,
        ".  " +
          makeAutocompleteTag(
            titleElement[0],
            format,
            getSettingValue(stores, "SETTING/EDITOR/AUTOCOMPLETE_FORMAT"),
            tagID,
            false,
            true
          )
      );
      idiomText = idiomText.replace(
        /. \[TITLE\]/gi,
        ". " +
          makeAutocompleteTag(
            titleElement[0],
            format,
            getSettingValue(stores, "SETTING/EDITOR/AUTOCOMPLETE_FORMAT"),
            tagID,
            false,
            true
          )
      );
    }

    tagID =
      titleElement[0].elementId +
      "-" +
      getTimeStamp() +
      "-" +
      Math.random().toString(36).substring(2, 11);
    // 자동완성 태그로 변경
    return idiomText.replace(
      /\[TITLE\]/gi,
      makeAutocompleteTag(
        titleElement[0],
        format,
        getSettingValue(stores, "SETTING/EDITOR/AUTOCOMPLETE_FORMAT"),
        tagID,
        false,
        false
      )
    );
  } catch (e: any) {
    console.log(e);
    return e?.message;
  }
}
dddddddd;

// 숫자 배열 오름차순 정렬
export const ascSort = (targetArray: any) => {
  targetArray.sort(function (a: number, b: number) {
    return a - b;
  });

  return targetArray;
};

export function f_strNullCheck(str: unknown): string {
  let newStr = str;

  if (
    newStr === null ||
    newStr === "" ||
    newStr === undefined ||
    newStr === "undefined"
  ) {
    newStr = "";
  }
  return newStr as string;
}

export function f_numNullCheck(str: unknown): number {
  let newStr = str;

  if (
    newStr === null ||
    newStr === "" ||
    newStr === undefined ||
    newStr === "undefined"
  ) {
    newStr = 0;
  }
  return newStr as number;
}

export function f_boolNullCheck(str: unknown): boolean {
  let newStr = str;

  if (
    newStr === null ||
    newStr === "" ||
    newStr === undefined ||
    newStr === "undefined"
  ) {
    newStr = false;
  }
  return newStr as boolean;
}

export function getImgUrlByCardType(cardType: string) {
  if (cardType === "master") return getImgUrl("draft/mastercard-icon.svg");
  else if (cardType === "visa") return getImgUrl("draft/visacard-icon.svg");
}

export function getImgUrl(url: string) {
  return new URL(`../images/${url}`, import.meta.url).href;
}

// 설명:            정보 모달 표시 -> Title은 Information으로 고정. 모달 밖 클릭으로 닫힘. 자동닫힘 적용
// Arguement:       stores -> pinia store 포함하고 있는 객체. ms: modalStore, as: appStore 필수
//                  modalMsg -> 표시할 메시지, modalBtnTxt -> 확인 버튼에 들어갈 텍스트(yes/no/ok/confirm/close/cancel)
//                  duration -> alert duration (자동닫힘) 적용 여부
// Return:          -
export function openInfoModal(
  stores: any,
  modalMsg: string,
  duration = false,
  modalBtnTxt = "ok"
) {
  const lang = stores.as.lang;
  stores.ms.infoModal.hide();
  stores.ms.infoModal.info = true;
  stores.ms.infoModal.alert = false;
  stores.ms.infoModal.title = "";
  stores.ms.infoModal.desc = makeFirstCharacterUpperCase(modalMsg);
  stores.ms.infoModal.buttonType = "N";
  stores.ms.infoModal.noButtonText = buttonText[modalBtnTxt][lang];
  stores.ms.infoModal.noButtonFunc = () => {
    stores.ms.infoModal.hide();
  };
  if (duration)
    stores.ms.infoModal.duration =
      getSettingValue(stores, "SETTING/GENERAL/ALERT_DURATION") * 1000;
  stores.ms.infoModal.closeBtn = false;
  // 모달 열기
  stores.ms.infoModal.show();
}

// 설명:            경고 모달 표시 -> Title은 경고 아이콘 + Alert로 고정. 모달 밖 클릭으로 닫히지 않음.
// Arguement:       stores -> pinia store 포함하고 있는 객체. ms: modalStore, as: appStore 필수
//                  modalMsg -> 표시할 메시지 또는 에러코드, modalBtnTxt -> 확인 버튼에 들어갈 텍스트(yes/no/ok/close/cancel)
//                  yesFunc -> 확인 버튼 함수에 넣을 기능. 없으면 null
// Return:          -
export function openAlertModal(
  stores: any,
  modalMsg: string | number,
  modalBtnTxt = "ok"
) {
  const lang = stores.as.lang;
  stores.ms.infoModal.hide();
  stores.ms.infoModal.title = "";
  stores.ms.infoModal.info = false;
  stores.ms.infoModal.alert = true;
  typeof modalMsg === "string"
    ? (stores.ms.infoModal.desc = makeFirstCharacterUpperCase(modalMsg))
    : (stores.ms.infoModal.desc = makeFirstCharacterUpperCase(
        errorMessages[modalMsg][lang]
      ));
  stores.ms.infoModal.buttonType = "N";
  stores.ms.infoModal.noButtonText = buttonText[modalBtnTxt][lang];
  stores.ms.infoModal.noButtonFunc = () => {
    stores.ms.infoModal.hide();
  };
  stores.ms.infoModal.duration = null;
  stores.ms.infoModal.closeBtn = false;
  stores.ms.infoModal.uncloseClickBack = true;

  // 모달 열기
  stores.ms.infoModal.show();
}

// 설명:            I18N 텍스트 전달
// Arguement:       stores -> pinia store 포함하고 있는 객체. as: appStore, is: i18nStore 필수
//                  key -> i18n 키값, category -> i18n데이터 구분. 기본 contents. 그 외 setting_titles / setting_descs
//                  yesFunc -> 확인 버튼 함수에 넣을 기능. 없으면 null
// Return:          사용자 언어 설정에 맞는 I18N 데이터
export function getI18NTxt(stores: any, key: string, category = "contents") {
  try {
    // return stores.is[category][stores.us.getLang][key];
    return stores.is[category]["UI_LANGUAGE/" + stores.as.lang][key];
  } catch (e) {
    console.log(e);
    return "NULLI18N";
  }
}

// 설명:            vue-i18n Locale 텍스트 전달
// Arguement:       t-> vue-i18n에서 정의한 함수, key -> 키 string
// Return:          설정된 i18n locale에 맞는 텍스트
export function getLocaleTxt(t: any, key: string) {
  return t(key);
}

// 설명:            사용자 이름 가져오기
// Arguement:       stores -> pinia store 포함하고 있는 객체. us: userStore 필수
// Return:          사용자 이름
export function getUILang(stores: any) {
  try {
    return stores.us.getLang;
  } catch (e) {
    console.log(e);
    return "NULLLANGUAGE";
  }
}

// 설명:            사용자 이름 가져오기
// Arguement:       stores -> pinia store 포함하고 있는 객체. us: userStore 필수
// Return:          사용자 이름
export function getUserName(stores: any) {
  try {
    return stores.us.getName;
  } catch (e) {
    console.log(e);
    return "NULLNAME";
  }
}

// 설명:            사용하는 시간대 가져오기
// Arguement:       stores -> pinia store 포함하고 있는 객체. us: userStore 필수
// Return:          사용하는 시간대
export function getTimezone(stores: any) {
  try {
    return stores.us.getTimezone;
  } catch (e) {
    console.log(e);
    return "NULLTIMEZONE";
  }
}

// 설명:            컬러 코드 가져오기
// Arguement:       stores -> pinia store 포함하고 있는 객체. ts: templateStore 필수, key -> 키 string
// Return:          사용자 이름
export function getColor(stores: any, key: string) {
  try {
    const color = stores.ts.palette["THEME_COLOR/" + key];
    if (color && color !== "NULLCOLOR") return color;
    else return stores.ts.palette["THEME_COLOR/PRIMARY"];
  } catch (e) {
    console.log(e);
    return "NULLCOLOR";
  }
}

// 설명:            셋팅값 가져오기
// Arguement:       stores -> pinia store 포함하고 있는 객체. us: userStore 필수, key -> 키 string
// Return:          사용자 이름
export function getSettingValue(stores: any, key: string) {
  try {
    return stores.us.settings[key];
  } catch (e) {
    console.log(e);
    return "NULLVALUE";
  }
}

// 설명:            관용어구 가져오기
// Arguement:       stores -> pinia store 포함하고 있는 객체. ws: workspaceStore 필수, key -> 키 string
// Return:          사용자 이름
export function getIdiomData(stores: any, key: string) {
  try {
    let returnTxt = "";
    for (let i = 0; i < stores.ws.idioms.length; i++) {
      if (stores.ws.idioms[i].dr_idiom_code_path === key) {
        returnTxt = stores.ws.idioms[i].idiom_contents;
        break;
      }
    }
    return returnTxt;
  } catch (e) {
    console.log(e);
    return "NULLIDIOM";
  }
}

// 설명:            UTC 시간을 사용자의 timezone 시간 객체로
// Arguement:       timeString -> 시간 String, from -> 변환 전 국가, to -> 변환 후 국가
// Return:          from에서 to로 변환된 시간 객체를 반환
export function getUserTime(UTCString: string, timezone: string) {
  const utcTime = Date.parse(UTCString);

  let hourDiff = 0;
  let minuteDiff = 0;

  if (timezone.substring(3, 4) === "+") {
    hourDiff = hourDiff + parseInt(timezone.substring(4, 6));
    minuteDiff = minuteDiff + parseInt(timezone.substring(7, 9));
  } else {
    hourDiff = hourDiff - parseInt(timezone.substring(4, 6));
    minuteDiff = minuteDiff - parseInt(timezone.substring(7, 9));
  }

  const TIME_DIFF = hourDiff * 60 * 60 * 1000 + minuteDiff * 60 * 1000;
  return new Date(utcTime + TIME_DIFF);
}

// 설명:            날짜+시간을 원하는 포맷으로 변환해서 반환
// Arguement:       format -> 시간 형식, 대소문자 구분함. yyyy:년도, MM: 월, dd: 날짜. 기본은 yyyy-MM-dd HH:mm:ss, time -> Date 객체. 기본은 현재
// Return:          날짜+시간 string
export function getDateTimeByFormat(
  format = "yyyy-MM-dd HH:mm:ss",
  time: Date = new Date()
) {
  if (!time.getFullYear()) return "-";
  const year = time.getFullYear(); //yyyy
  const month = 1 + time.getMonth(); //
  const day = time.getDate(); //dd
  const hours = time.getHours(); //HH
  const minutes = time.getMinutes(); //mm
  const seconds = time.getSeconds(); //ss
  return format
    .replace("yyyy", year.toString())
    .replace("MM", month >= 10 ? month.toString() : "0" + month.toString())
    .replace("dd", day >= 10 ? day.toString() : "0" + day.toString())
    .replace("HH", hours >= 10 ? hours.toString() : "0" + hours.toString())
    .replace(
      "mm",
      minutes >= 10 ? minutes.toString() : "0" + minutes.toString()
    )
    .replace(
      "ss",
      seconds >= 10 ? seconds.toString() : "0" + seconds.toString()
    );
}

// 설명:            서비스 유형에 따라 대응되는 국가의 날짜 표시 양식을 반환
// Arguement:       formatCode -> FORMAT/KIPO 등
// Return:          날짜 양식
export function getDateFormat(formatCode: string) {
  // KIPO하고 JPO는 기본값 사용
  let formatString = "yyyy-MM-dd";
  if (formatCode === "FORMAT/USPTO") formatString = "MM-dd-yyyy";
  else if (formatCode == "FORMAT/EPO") formatString = "dd-MM-yyyy";
  return formatString;
}

// 설명:            날짜 차이 계산
// Arguement:       from, to -> 계산하려는 날짜, format -> 날짜 형식
// Return:          날짜 양식
export function getDateDiff(from: string, to: string, format: string) {
  let fromYear = "";
  let fromMonth = "";
  let fromDay = "";
  let toYear = "";
  let toMonth = "";
  let toDay = "";
  if (format === "yyyy-MM-dd") {
    fromYear = from.substring(0, 4);
    fromMonth = from.substring(5, 7);
    fromDay = from.substring(8, 10);
    toYear = to.substring(0, 4);
    toMonth = to.substring(5, 7);
    toDay = to.substring(8, 10);
  } else if (format === "MM-dd-yyyy") {
    fromYear = from.substring(6, 10);
    fromMonth = from.substring(0, 2);
    fromDay = from.substring(3, 5);
    toYear = to.substring(6, 10);
    toMonth = to.substring(0, 2);
    toDay = to.substring(3, 5);
  } else if (format === "dd-MM-yyyy") {
    fromYear = from.substring(6, 10);
    fromMonth = from.substring(3, 5);
    fromDay = from.substring(0, 2);
    toYear = to.substring(6, 10);
    toMonth = to.substring(3, 5);
    toDay = to.substring(0, 2);
  }
  const fromDate = new Date(fromYear + "-" + fromMonth + "-" + fromDay);
  const toDate = new Date(toYear + "-" + toMonth + "-" + toDay);
  const diffDate = fromDate.getTime() - toDate.getTime();
  const dateDays = Math.abs(diffDate / (1000 * 3600 * 24));
  return dateDays;
}

// 설명:            숫자에 세 자리 마다 컴마 추가해서 반환
// Arguement:       dataURI -> URI 스트링
// Return:          세 자리 마다, 붙은 string
export function getAddCommaString(num: number): string {
  const regexp = /\B(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(regexp, ",");
}

// 설명:            dataURI를 Blob 파일로 변환
// Arguement:       dataURI -> URI 스트링
// Return:          Blob 객체
export function dataURItoBlob(dataURI: string): Blob {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

export async function dataURLtoFile(dataurl: string, fileName: string) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) u8arr[n] = bstr.charCodeAt(n);

  return new File([u8arr], fileName, { type: mime });
}

// 출처: https://uminoh.tistory.com/26?category=1028116
// 설명:            이미지 썸네일 생성
// Arguement:       image -> 변환할 이미지 객체, file -> 변환할 파일 객체
// Return:          Blob 객체
export function getThumbImgFile(image: HTMLImageElement, file: File): File {
  const canvas = document.createElement("canvas");
  const base_size = ONE_KB * 100; //100KB (썸네일 작업 유무 기준 사이즈)
  const comp_size = ONE_KB * 10; //10KB (썸네일 작업 결과물 사이즈, 5~20KB 수준으로 압축됨)
  let width = image.width;
  let height = image.height;
  const size = file.size;

  if (size <= base_size) return file;

  // file size / comp_size 의 제곱근으로 각 너비, 높이를 나눠 압축함
  const ratio = Math.ceil(Math.sqrt(size / comp_size));
  (width = image.width / ratio), (height = image.height / ratio);
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
  const blob = dataURItoBlob(canvas.toDataURL("image/png"));
  return new File([blob], file.name, { type: file.type });
}

export function getCodeFromLang(lang: string) {
  lang = lang.toLowerCase();
  if (lang.includes("ko")) {
    return "UI_LANGUAGE/KO";
  } else if (lang.includes("ja")) {
    return "UI_LANGUAGE/JA";
  } else if (lang.includes("en")) {
    return "UI_LANGUAGE/EN";
  } else {
    return "UI_LANGUAGE/EN";
  }
}

export function removePTag(data: string) {
  return data ? data.replace(/<(\/?)p>/gi, "") : "";
}

export function removeAllTag(data: string) {
  return data.replace(
    /<(\/)?([a-zA-Z0-9]*)(\s[a-zA-Z0-9]*=[^>]*)?(\s)*(\/)?>/gi,
    ""
  );
}

export function removeNewLine(data: string) {
  return data.replace(/\\n/gi, "");
}

export function makeDocumentText(source: string, gubun: string, data: string) {
  if (gubun === "title")
    return source.concat(
      "<p style='text-indent: 0rem' contentEditable='false'>【",
      data,
      "】</p>"
    );
  else return source.concat("<p>", data, "</p>");
}

export function isInlineEditorEmpty(editor: any) {
  // WIRIS에 의해 삽입된 수식 포함된 <math 태그가 있으면 빈 것으로 판단하지 않음
  // -> 일단 tinymce inlineconfig에서 wiris는 뺐음. 자동완성 관련 버그 존재
  // TODO: 인라인 에디터에도 wiris가 들어가고 잘 보일 수 있도록 구현
  // 2022.07.20. 확인된 문제: 구성요소 리스트에서 wiris 스타일이 먹지 않음. tinymce에디터에서 자동완성 입력까지는 잘 되는데 스타일 안먹음.
  //                         구성요소 수정해서 에디터 내용 갱신할 때 wiris 스타일 안먹게 변함
  if (
    editor?.getContent({ format: "text" }).trim() === ""
    // && editor?.getContent().indexOf("<math") < 0
  )
    return true;
  else return false;
}

// 크롬 확인
export function isChrome() {
  const agent = navigator.userAgent.toLowerCase();
  // console.log(agent);
  let browserName = "";

  if (agent.indexOf("edge") > -1 || agent.indexOf("edg") > -1) {
    browserName = "edge";
  } else if (agent.indexOf("opr") > -1) {
    browserName = "opera";
  } else if (agent.indexOf("samsungbrowser") > -1) {
    browserName = "samsungbrowser";
  } else if (agent.indexOf("daum") > -1) {
    browserName = "Daum";
  } else if (agent.indexOf("naver") > -1) {
    browserName = "NAVER";
  } else if (agent.indexOf("ucbrowser") > -1) {
    browserName = "ucbrowser";
  } else if (agent.indexOf("kakaotalk") > -1) {
    browserName = "kakaotalk";
  } else if (agent.indexOf("line/") > -1) {
    browserName = "linebrowser";
  } else if (agent.indexOf("firefox") > -1) {
    browserName = "firefox";
  } else if (agent.indexOf("msie") > -1 || agent.indexOf("trident") > -1) {
    browserName = "ie";
  } else if (agent.indexOf("chrome") > -1) {
    browserName = "Chrome";
  } else if (agent.indexOf("crios") > -1) {
    browserName = "chrome";
  } else if (agent.indexOf("safari") > -1) {
    browserName = "safari";
  }

  if (browserName === "Chrome" || browserName === "chrome") return true;
  else return false;

  // // Opera 8.0+
  // const isOpera =
  //   (!!window.opr && !!opr.addons) ||
  //   !!window.opera ||
  //   navigator.userAgent.indexOf(" OPR/") >= 0;

  // // Firefox 1.0+
  // const isFirefox = typeof InstallTrigger !== "undefined";

  // // Safari 3.0+ "[object HTMLElementConstructor]"
  // const isSafari =
  //   /constructor/i.test(window.HTMLElement) ||
  //   (function (p) {
  //     return p.toString() === "[object SafariRemoteNotification]";
  //   })(
  //     !window["safari"] ||
  //       (typeof safari !== "undefined" && safari.pushNotification)
  //   );

  // // Internet Explorer 6-11
  // const isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // // Edge 20+
  // const isEdge = !isIE && !!window.StyleMedia;

  // return !isOpera && !isFirefox && !isSafari && !isIE && !isEdge;
}

export function changeDataInI18NTxt(
  stores: any,
  source: string,
  searchString: string,
  replaceData: string
) {
  // 한국인 경우에는, 숫자 데이터 다음에 조사가 있을 가능성이 있음
  if (stores.as.lang === "KO") {
    const tempArray = source.split(" ");
    let returnTxt = "";
    for (let token of tempArray) {
      if (token.includes(searchString)) {
        // 조사 등이 붙어 있는 경우
        if (token.length !== searchString.length) {
          const frontText = token.substring(
            0,
            token.indexOf(searchString) + searchString.length
          );
          const josa = token.substring(
            token.indexOf(searchString) + searchString.length
          );
          token =
            frontText.replace(searchString, replaceData) +
            setJosa(replaceData, josa);
        }
        // 조사 등이 없는 경우
        else {
          token = token.replace(searchString, replaceData);
        }
      }
      returnTxt = returnTxt.concat(token, " ");
    }

    return returnTxt.trim();
  } else if (stores.as.lang === "JA") {
    return source.replaceAll(
      searchString,
      stores.as.lang === "JA" ? toJPFullWidth(replaceData) : replaceData
    );
  } else {
    return source.replaceAll(searchString, replaceData);
  }
}

export function changeAtoThe(source: string) {
  if (source.length < 2) return source;
  else if (source.length >= 2 && source.substring(0, 2).toLowerCase() === "a ")
    return "The " + source.substring(2);
  else if (source.length >= 3 && source.substring(0, 3).toLowerCase() === "an ")
    return "The " + source.substring(3);
  else return source;
}

export function splitDataToClaimsAndDescription(
  source: string,
  claimTitle: string,
  abstractTitle: string
) {
  let claimTxt = "";
  let descriptionTxt = "";
  if (!source.includes(claimTitle)) {
    return ["", ""];
  }

  descriptionTxt = source.substring(0, source.indexOf(claimTitle));
  if (
    source.includes(abstractTitle) &&
    source.indexOf(abstractTitle) > source.indexOf(claimTitle)
  )
    claimTxt = source.substring(
      source.indexOf(claimTitle),
      source.indexOf(abstractTitle)
    );
  else claimTxt = source.substring(source.indexOf(claimTitle));

  return [descriptionTxt, claimTxt];
}

export async function urlToFile(
  url: string,
  filename: string,
  mimeType: string
) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], filename, { type: mimeType });
}

export function showOnlyNameInAutocompletedElement(target: string) {
  const tempBody = document.createElement("div");
  let bodyTxt = target;
  tempBody.innerHTML = bodyTxt;
  const elementArray = tempBody.getElementsByClassName("autocomplete");
  for (let i = 0; i < elementArray.length; i++) {
    elementArray[i].textContent = elementArray[i].getAttribute("data-name");
  }
  bodyTxt = String(tempBody.innerHTML);
  const extractDivPattern = /<(\/div|div)([^>]*)>/gi;

  bodyTxt = bodyTxt.replace(extractDivPattern, "");

  return bodyTxt;
}

// 분할 템플릿 내에 명세서 기본 데이터 셋팅
function setupGeneralDataInTemplate(
  htmlTxt: string,
  stores: any,
  basicShowNumber: boolean,
  elementsListValue: string
) {
  // 상호참조
  htmlTxt = htmlTxt.replace(
    "$cross_reference$",
    stores.ws.caseData.cross_reference.data
  );

  // 기술분야
  htmlTxt = htmlTxt.replace(
    "$technical_field$",
    stores.ws.caseData.technical_field.data
  );

  // 배경기술
  htmlTxt = htmlTxt.replace("$background$", stores.ws.caseData.background.data);

  // summary
  htmlTxt = htmlTxt.replace("$summary$", stores.ws.caseData.summary.data);

  // 선행기술
  htmlTxt = htmlTxt.replace("$prior_art$", stores.ws.caseData.prior_art.data);

  // 해결하고자 하는 과제
  htmlTxt = htmlTxt.replace("$purpose$", stores.ws.caseData.purpose.data);

  // 효과
  htmlTxt = htmlTxt.replace("$effect$", stores.ws.caseData.advantages.data);

  // 도면의 간단한 설명
  htmlTxt = htmlTxt.replace(
    "$drawings_description$",
    stores.ws.caseData.drawing_description.data
  );

  // 산업상 이용 가능성
  htmlTxt = htmlTxt.replace(
    "$industrial_applicability$",
    stores.ws.caseData.industrial_applicability.data
  );

  // 서열목록 프리텍스트
  htmlTxt = htmlTxt.replace(
    "$sequencelist$",
    stores.ws.caseData.sequencelist.data
  );

  // 기본 영역 번호 표시 안하기 선택되어 있으면 명칭만 보여줌
  if (!basicShowNumber) htmlTxt = showOnlyNameInAutocompletedElement(htmlTxt);

  // 발명의 상세한 설명
  htmlTxt = htmlTxt.replace(
    "$detailed_description$",
    stores.ws.caseData.detailed_description.data
  );

  // 부호의 설명
  if (elementsListValue === "Y") {
    sortObjectArray(
      stores.ws.caseData.elements.list,
      "number",
      "string",
      "asc"
    );
    // console.log(stores.ws.caseData.elements.list);
    let elementsTxt = "";
    for (const element of stores.ws.caseData.elements.list) {
      if (element.itemType === "I") continue;

      if (
        removePTag(element.number).trim() === "" ||
        removePTag(element.number).trim() === "000"
      )
        continue;

      elementsTxt = elementsTxt + "<p>";
      elementsTxt =
        elementsTxt +
        removePTag(element.name) +
        " : " +
        removePTag(element.number);
      elementsTxt = elementsTxt + "</p>";
    }

    htmlTxt = htmlTxt.replace("$sign_description$", elementsTxt);
  } else htmlTxt = htmlTxt.replace("$sign_description$", "");

  return htmlTxt;
}

export function deficiencyCheckResultMsg(
  workspaceStore: any,
  msgType: string, // E: 에러
  msgCode: string, // 메시지 코드
  msgData1 = "", // 메시지 생성에 필요한 데이터 1
  msgData2 = "" // 메시지 생성에 필요한 데이터 2
) {
  let errorMsg = [] as string[];
  switch (msgCode) {
    case "NotEnoughInformation":
      errorMsg = [
        "판단을 위한 데이터가 충분하지 않습니다.",
        "Not enough data.",
        "十分なデータがありません。",
      ];
      break;
    case "NoData":
      errorMsg = [
        msgData1 + "이 없습니다.",
        "There is no '" + msgData1 + ".'",
        msgData1 + "がありません。",
      ];
      break;
    case "NoClaim":
      errorMsg = [
        "청구항이 없습니다.",
        "There is no claim",
        "請求項がありません。",
      ];
      break;
    case "OnlyOneData":
      errorMsg = [
        msgData1 +
          setJosa(msgData1, "이") +
          " " +
          msgData2 +
          "번 등장합니다. 하나만 허용됩니다.",
        "There are '" +
          msgData2 +
          "' '" +
          msgData1 +
          ".' Just one '" +
          msgData1 +
          "' is allowed.",
        msgData1 + "が" + msgData2 + "回登場します。1つだけ許可されます。",
      ];
      break;
    case "StartParsing":
      errorMsg = [
        "텍스트 분석 시작...",
        "Start text analysis...",
        "テキスト分析の開始…",
      ];
      break;
    case "ErrorCount":
      errorMsg = [
        "총 " + msgData1 + "개의 오류가 텍스트 분석에 의해 발견되었습니다.",
        "Total " + msgData1 + " errors are detected by the text analysis.",
        "合計" + msgData1 + "個のエラーがテキスト分析によって検出されました。",
      ];
      break;
  }

  let prefix = "";
  if (msgType === "E") prefix = "[ERROR] ";
  else if (msgType === "I") prefix = "[INFO] ";

  if (workspaceStore.caseMasterData.format_code_path === "FORMAT/KIPO")
    return prefix + errorMsg[0];
  else if (workspaceStore.caseMasterData.format_code_path === "FORMAT/USPTO")
    return prefix + errorMsg[1];
  else if (workspaceStore.caseMasterData.format_code_path === "FORMAT/JPO")
    return prefix + errorMsg[2];
}
