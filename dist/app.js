const domBtnGroup =  document.getElementsByClassName("btn-group");
const domTable =  document.getElementsByTagName("tbody");
const domLoading = document.getElementsByClassName("spinner-border");

let classList = [];  //class.json
let quizList = [];   //quiz.json

//json파일 가져오기
fetch('class.json')
    .then((response) => {
        response.json().then((datas) => {
            domLoading[0].style.display = 'none';
            for(i in datas) {
                datas[i].num = Number(i)+1;
            }
            classList = datas;
            addClassListDom(datas);
        });
    });
fetch('quiz.json')
    .then((response) => {
        response.json().then((datas) => {
            domLoading[1].style.display = 'none';
            quizList = datas;
            addQuizListDom(datas);
        });
    });


//학습리스트 데이터 채우기
const addClassListDom = (datas) => {
    //리스트 안에있는 뷰 전부 지우기
    while(domTable[0].hasChildNodes()) {
        domTable[0].removeChild(domTable[0].firstChild);
    }

    for(const data of datas) {
        const input = document.createElement('tr');

        //주차, 제목
        let html = `<th scope="row">${data.num}</th><td>${data.title}</td><td>`;

        //학습내용 있으면 문서버튼 추가
        if(data.docUrl != "") html += `<a href="${data.docUrl}" class="badge bg-secondary">문서</a>`;

        html += `</td><td>`;

        //도움링크의 개수만큼 도움링크버튼 추가
        for(linkNum in data.links) {
            html += `<a href="${data.links[linkNum]}" class="badge bg-secondary">${Number(linkNum) +1}</a>`;
        }

        //날짜
        html += `</td><td>${data.date}</td><td>`;

        //실습링크가 있으면 실습버튼 추가
        if(data.gitUrl != "") html += `<a href="${data.gitUrl}">git</a>`;

        html += `</td>`;

        input.innerHTML = html;
        domTable[0].appendChild(input);
    }
}

//퀴즈리스트 데이터 채우기
const addQuizListDom = (datas) => {
    //리스트 안에있는 뷰 전부 지우기
    while(domTable[1].hasChildNodes()) {
        domTable[1].removeChild(domTable[1].firstChild);
    }

    for(const data of datas) {
        const input = document.createElement('tr');

        input.innerHTML = `
        <tr>
          <td>${data.title}</td>
          <td>
            <a class="badge bg-secondary" href="${data.docUrl}">
                문서
            </a>
          </td>
          <td><a href="${data.previewUrl}">보기</a></td>
          <td><a href="${data.gitUrl}">git</a></td>
        </tr>`;

        domTable[1].appendChild(input);
    }
}

//학습리스트 필터함수
const classFilter = (num, list) => {
    switch (num) {
        //모두
        case "0":
            return list;

        //도움링크
        case "1":
            return list.filter(data => data.links.length > 0);
        //git
        case "2":
            return list.filter(data => data.gitUrl !== '');
        //최신순
        case "3":
            return [...list].reverse();

        default:
            console.log(`ERROR: classFilter(${num})`);
            return [];
    }
}

//퀴즈리스트 필터함수
const quizFilter = (num, list) => {
    switch (num) {
        //모두
        case "0":
            return list;

        //git
        case "1":
            return list.filter(data => data.gitUrl !== '');

        default:
            console.log(`ERROR: quizFilter(${num})`);
            return [];
    }
}

//필터버튼 이벤트
for(const i in domBtnGroup[0].children) {
    domBtnGroup[0].children[i].onclick = (_) => {
        for(k of domBtnGroup[0].children) {
            k.classList.remove('active');
        }
        domBtnGroup[0].children[i].classList.add('active');

        addClassListDom(classFilter(i, classList));
    }
}
for(const i in domBtnGroup[1].children) {
    domBtnGroup[1].children[i].onclick = (_) => {
        for(k of domBtnGroup[1].children) {
            k.classList.remove('active');
        }
        domBtnGroup[1].children[i].classList.add('active');

        addQuizListDom(quizFilter(i, quizList));
    }
}