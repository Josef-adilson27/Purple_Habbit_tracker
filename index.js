'use strict'

let habbits = [{
      "id": 1,
      "icon": "sport",
      "name": "Отжимания",
      "target": 10,
      "days": [
            { "comment": "Первый подход" },
            { "comment": "Уже проще" },
      ]
},
{
      "id": 2,
      "icon": "food",
      "name": "Правильное питание",
      "target": 10,
      "days": [
            { "comment": "Круто" }
      ]
}];

console.log(habbits);
 
let HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbitId;

const page = {
      menu: document.querySelector(".menu__list"),
      haeder: {
            h1: document.querySelector(".h1"),
            progressPercent: document.querySelector(".progress__persent"),
            progressCoverBar: document.querySelector(".progress__cover-bar")
      },
      content: {
            daysContainer: document.querySelector("#days"),
            nextDatay: document.querySelector(".habbit__day"),
      },
      popup:{
            index: document.querySelector("#add_popup"),
            close: document.querySelector(".close-btn"),
            add: document.querySelector(".menu__add"),
          
      }
}



function loding() {

      const habbitsString = localStorage.getItem(HABBIT_KEY);
      const habbitArray = JSON.parse(habbitsString);

      if (Array.isArray(habbitArray)) {
            habbits = habbitArray
      }

}

function saveData() {
      localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits))
}

///render

page.popup.close.addEventListener('click', toglle)
page.popup.add.addEventListener('click', toglle)



 function toglle(){ 
      if(page.popup.index.classList.contains('cover_hidden')){
           return page.popup.index.classList.remove('cover_hidden')
      }else{
            return page.popup.index.classList.add('cover_hidden')
      }
}

function rerenderMernu(activeHabbit) {
      if (!activeHabbit) {
            return
      }
      for (const habbit of habbits) {

            let existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)

            if (!existed) {
                  const element = document.createElement('button')
                  element.setAttribute('menu-habbit-id', habbit.id)
                  element.classList.add('menu__item')
                  element.addEventListener('click', () => {
                        rerender(habbit.id)
                  })
                  element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" menu-habbit-id="${habbit.id}">`

                  if (activeHabbit.id === habbit.id) {
                        element.classList.add('menu__item_active')
                  }
                  page.menu.appendChild(element)
                  continue;
            }
            if (activeHabbit.id === habbit.id) {
                  existed.classList.add('menu__item_active')
            } else {
                  existed.classList.remove('menu__item_active')
            }
      }
}

function renderHead(activeHabbit) {
      if (!activeHabbit) {
            return
      }
      console.log(page.haeder.h1.innerText);
      page.haeder.h1.innerText = activeHabbit.name;
      const progress = activeHabbit.days.length / activeHabbit.target > 1
            ? 100 : activeHabbit.days.length / activeHabbit.target * 100
      page.haeder.progressPercent.innerText = progress.toFixed(0) + '%'
      page.haeder.progressCoverBar.setAttribute('style', `width:${progress}%`)
}

function renderContent(activeHabbit) {
      page.content.daysContainer.innerHTML = '';
      for (const index in activeHabbit.days) {
            const element = document.createElement('div')
            element.classList.add('habbit')
            element.innerHTML =`<div class="habbit__day">День ${Number(index) + 1 }</div>
                              <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
                              <button class="habbit__delete" onclick="deleteDay(${index})">
                                  <img src="./images/remove.svg" alt="remove ${index} day">
                              </button>`
                              page.content.daysContainer.appendChild(element)
      }
     
     page.content.nextDatay.innerHTML =  `День ${activeHabbit.days.length + 1}`
}

function rerender(activeHabbitId) {
      globalActiveHabbitId = activeHabbitId
      const activeHabbit = habbits.find(item => item.id === activeHabbitId)

      if(!activeHabbit){
            return
      }

      rerenderMernu(activeHabbit)
      renderHead(activeHabbit)
      renderContent(activeHabbit)
}

function addDays(event){

      
      event.preventDefault()

      const data = validateForm(event.target, ['comment'])

      if(!data){
            return
      }

      habbits = habbits.map(item=>{
      if(item.id === globalActiveHabbitId){
            return{
                  ...item,
                  days: item.days.concat([{comment: data.comment}])
            }
      }
      return item
     })

     resetForm(event.target, ['comment'])
     rerender(globalActiveHabbitId)
     saveData()
}

function deleteDay(index){
      habbits = habbits.map(item=>{
            if(item.id === globalActiveHabbitId){
             item.days.splice(index,1)
             return{
                  ...item,
                  days:item.days
             }
            }
            return item
           }) 
           rerender(globalActiveHabbitId)
           saveData()
}

function addHabbits(event){

      event.preventDefault()

      const data = validateForm(event.target, ['name', 'target'])

      if(!data){
            return
      } 

      const maxId = habbits.reduce((acc, habbit)=>acc> habbit.id ? acc : habbit.id, 0)

      habbits.push({
            id:maxId + 1,
            name: data.name,
            target: data.target,
            icon:data.icon,
            days: []
      })

      resetForm(event.target, ['name', 'target'])
      rerender(maxId+1)
      toglle()
      saveData()
      console.log(habbits);
}


function resetForm(form, fields){

      for (const field of fields) {
           form[field].value = ''
      }

}

function validateForm(form, fields){

    
      const formDatata = new FormData(form) 

      let res = {}

      for (const field of fields) {
          const fieldElement = formDatata.get(field)  
          res[field] = fieldElement          
      }

     let isValid = true;

     for (const field of fields) {
      if(!res[field]){
            isValid = false
      }
      
     }
     if(!isValid){
      return
     }
     return res
}

(() => {

      loding()
      saveData()
      rerenderMernu()
      rerender(habbits[0].id) 

})()