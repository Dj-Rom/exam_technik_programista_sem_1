const form = document.querySelector('.main_form_zdarzenia');
const table = document.querySelector('.tbody');
const error_message_form = document.querySelector('.error_span_form');
const licznik = document.querySelector('.main_licznik_span');
const filter = document.querySelector('.main_filter_date_input');

form.addEventListener('submit', functionSubmite);
filter.addEventListener('change', functionFilter);
licznik.innerHTML = JSON.parse(localStorage.getItem('zdarzenia')).length;
functionTable();
function functionSubmite(e) {
  let ls = JSON.parse(localStorage.getItem('zdarzenia'));
  let dataZdarzen = [];
  const allFilled = Array.from(e.target.elements)
    .filter(
      (element) => element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'
    )
    .every((element) => element.value.trim());

  allFilled
    ? (error_message_form.innerHTML = '')
    : (error_message_form.innerHTML = 'Są niewypełnione pola');

  if (localStorage.getItem('zdarzenia') && ls.length > 0) {
    const dataLS = ls;
    if (allFilled) {
      const formData = Array.from(e.target.elements).reduce((data, el) => {
        if (el.name) data[el.name] = el.value.trim();
        return data;
      }, {});
      let id = dataLS.map((e) => e.id);

      formData.id = Math.max(...id) + 1;
      dataLS.push(formData);
      localStorage.setItem('zdarzenia', JSON.stringify(dataLS));
    }
  } else {
    if (allFilled) {
      const formData = Array.from(e.target.elements).reduce((data, element) => {
        if (element.name) data[element.name] = element.value.trim();
        return data;
      }, {});
      dataZdarzen.push(formData);
      formData.id = 1;
      licznik.innerHTML = 1;
      functionTable(dataZdarzen);
      localStorage.setItem('zdarzenia', JSON.stringify(dataZdarzen));
    }
  }
  licznik.innerHTML = ls.length;
  functionTable();
  return form.removeEventListener('submit', functionSubmite);
}

function functionTable(data = JSON.parse(localStorage.getItem('zdarzenia'))) {
  table.innerHTML = '';
  if (data) {
    data.map((e) => {
      table.innerHTML += `
         <tr>
            <td>${e.id}</td>
            <td>${e.nazweZdarzenia || ' brak dannych'}</td>
            <td>${e.dataZdarzenia || ' brak dannych'}</td>
            <td>${e.poleTextowe || ' brak dannych'}</td> 
            <td><button class="main_table_btn_del" onclick={deleteItem(${
              e.id
            })}>usuń</button></td>
          </tr>
        `;
    });
  } else {
    table.innerHTML += ` <tr>
      <td>brak dannych</td>
      <td>brak dannych</td>
      <td>brak dannych</td>
      <td>brak dannych</td>
      <td>brak dannych</td>
    </tr>`;
  }
}

function deleteItem(id) {
  let ls = JSON.parse(localStorage.getItem('zdarzenia'));
  const newls = ls.filter((e) => e.id !== id);
  localStorage.setItem('zdarzenia', JSON.stringify(newls));
  functionTable();
  licznik.innerHTML = newls.length;
}

function functionFilter(e) {
  let ls = JSON.parse(localStorage.getItem('zdarzenia')) || [];
  const newls = ls.filter((elem) => elem.dataZdarzenia == e.target.value);
  functionTable(newls.length ? newls : ls);
  document.querySelector('.error_span_filter').innerHTML = newls.length
    ? ''
    : 'brak, tej daty';
}
