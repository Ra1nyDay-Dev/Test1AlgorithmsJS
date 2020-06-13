class TestRunner {
   constructor(name) {
      this.name = name
      this.testNo = 1
   }

   expectTrue(cond) {
      try {
         if (cond()) {
            this._pass()
         } else {
            this._fail()
         }
      } catch (e) {
         this._fail(e)
      }
   }

   expectFalse(cond) {
      this.expectTrue(() => !cond())
   }

   expectException(block) {
      try {
         block()
         this._fail()
      } catch (e) {
         this._pass()
      }
   }

   _fail(e = undefined) {
      console.log(`FAILED: Test #${this.testNo++} of ${this.name}`)
      if (e != undefined) {
         console.log(e)
      }
   }

   _pass() {
      console.log(`PASSED: Test #${this.testNo++} of ${this.name}`)
   }
}

function match({ string, pattern }) {  // РЕШЕНИЕ ЗАДАЧИ 1 //
   
      // Для наглядности и удобства проверки я разделил код на подфункции для каждого условия в задании

   let matches=0;
   checkLength();
   checkDights();
   checkLetters();
   checkLettersAndDights();
   checkSpaces();
   checkValidCharacters();


   return matches==5?true:false;

   function checkLength() {  // Проверяем совпадение количества символов шаблона и строки
      if (string.length == pattern.length) matches++;
   }

   function checkValidCharacters() { // проверяем, что pattern содержит допустимые символы
      for (let i=0; i<pattern.length; i++) { 
      if (!(pattern[i]=="a" || pattern[i]=="d" || pattern[i]==" " || pattern[i]=="*")) {
            throw new Error("В Pattern обнаружены некорректные символы");
         }
      }
   }

   function checkSpaces() { // проверяем, что пробелы совпадают и стоят на тех же индексах
      if (string.indexOf(" ")!=-1 || pattern.indexOf(" ")!=-1) {
         for(var i=0; i<string.length; i++){
            if(string[i]==" " && string[i]!=pattern[i]) return false;
         }
         for(var i=0; i<pattern.length; i++){
            if(pattern[i]==" " && pattern[i]!=string[i]) return false;
         } matches++;
      } else {
         matches++;
      }
   }

   function checkDights() { // проверяем, что "d" в pattern = цифре в string
      if (pattern.indexOf("d")!=-1) {
         for(var i=0; i<pattern.length; i++){
            if(pattern[i]=="d" && /\d/.test(string[i])!=true) return false;
         } matches++;
      } else {
         matches++;
      }
   }
      
   function checkLetters() { // проверяем, что "a" в pattern = букве в string
      if (pattern.indexOf("a")!=-1) {
         for(var i=0; i<pattern.length; i++){
            if(pattern[i]=="a" && /[a-z]/.test(string[i])!=true) return false;
         } matches++;
      } else {
         matches++;
      }
   }

   function checkLettersAndDights() { // проверяем, что "*" в pattern = букве или цифре в string
      if (pattern.indexOf("*")!=-1) {
         for(var i=0; i<pattern.length; i++){
            if(pattern[i]=="*" && /[\d|a-z]/.test(string[i])!=true) return false;
         } matches++;
      } else {
         matches++;
      }
   }
}

function testMatch() {
   const runner = new TestRunner('match')

   runner.expectFalse(() => match({ string: 'xy', pattern: 'a' }))
   runner.expectFalse(() => match({ string: 'x', pattern: 'd' }))
   runner.expectFalse(() => match({ string: '0', pattern: 'a' }))
   runner.expectFalse(() => match({ string: '*', pattern: ' ' }))
   runner.expectFalse(() => match({ string: ' ', pattern: 'a' }))

   runner.expectTrue(() => match({ string: '01 xy', pattern: 'dd aa' }))
   runner.expectTrue(() => match({ string: '1x', pattern: '**' }))

   runner.expectException(() => match({ string: 'x', pattern: 'w' }))
}

const tasks = {
   id: 0,
   name: 'Все задачи',
   children: [
      {
         id: 1,
         name: 'Разработка',
         children: [
            { id: 2, name: 'Планирование разработок', priority: 1 },
            { id: 3, name: 'Подготовка релиза', priority: 4 },
            { id: 4, name: 'Оптимизация', priority: 2 },
         ],
      },
      {
         id: 5,
         name: 'Тестирование',
         children: [
            {
               id: 6,
               name: 'Ручное тестирование',
               children: [
                  { id: 7, name: 'Составление тест-планов', priority: 3 },
                  { id: 8, name: 'Выполнение тестов', priority: 6 },
               ],
            },
            {
               id: 9,
               name: 'Автоматическое тестирование',
               children: [
                  { id: 10, name: 'Составление тест-планов', priority: 3 },
                  { id: 11, name: 'Написание тестов', priority: 3 },
               ],
            },
         ],
      },
      { id: 12, name: 'Аналитика', children: [] },
   ],
}

function findTaskHavingMaxPriorityInGroup({ tasks, groupId }) {  // РЕШЕНИЕ ЗАДАЧИ 2 //

   let objectWithGroupId;
   let objectWithMaxPriority;
   let maxPriority=0;

   getObjectWithGroupId(tasks);

   if (objectWithGroupId==undefined) {
      throw new Error ("Объект не является группой или группы с указанным ID не существует");
   }
   else {
      getObjectWithMaxPriority(objectWithGroupId);
   }

   return objectWithMaxPriority;

   function getObjectWithGroupId(object = tasks) {  // Перебираем все задачи и находим объект с указанным groupID
      for(var prop in object) {
         if(typeof(object[prop]) === 'object') {
            getObjectWithGroupId(object[prop]);
         } else if (prop=="id" && object[prop]==groupId && object.priority==undefined) { 
            objectWithGroupId = object;      
         } 
      }
   }

   function getObjectWithMaxPriority(object = objectWithGroupId){ // Перебираем все подзадачи и находим объект с максимальным приоритетом
      for(var prop in object) {
         if(typeof(object[prop]) === 'object') {
            getObjectWithMaxPriority(object[prop]);
         } else if (maxPriority<object.priority) { 
            maxPriority = object.priority;
            objectWithMaxPriority = object;      
         }
      }
   }

}

function taskEquals(a, b) {
   return (
      a.children == undefined &&
      b.children == undefined &&
      a.id == b.id &&
      a.name == b.name &&
      a.priority == b.priority
   )
}

function testFindTaskHavingMaxPriorityInGroup() {
   const runner = new TestRunner('findTaskHavingMaxPriorityInGroup')

   runner.expectException(() => findTaskHavingMaxPriorityInGroup({ tasks, groupId: 13 }))
   runner.expectException(() => findTaskHavingMaxPriorityInGroup({ tasks, groupId: 2 }))

   runner.expectTrue(() => findTaskHavingMaxPriorityInGroup({ tasks, groupId: 12 }) == undefined)

   runner.expectTrue(() =>
      taskEquals(findTaskHavingMaxPriorityInGroup({ tasks, groupId: 0 }), {
         id: 8,
         name: 'Выполнение тестов',
         priority: 6,
      }),
   )
   runner.expectTrue(() =>
      taskEquals(findTaskHavingMaxPriorityInGroup({ tasks, groupId: 1 }), {
         id: 3,
         name: 'Подготовка релиза',
         priority: 4,
      }),
   )
   runner.expectTrue(() => findTaskHavingMaxPriorityInGroup({ tasks, groupId: 9 }).priority == 3)
}

testMatch()
testFindTaskHavingMaxPriorityInGroup()