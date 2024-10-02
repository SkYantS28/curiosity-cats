const URL = 'https://cat-fact.herokuapp.com/facts'; // URL da API p fazer requisições e obter dados
// requisição == 'get' (curiosidades) == processo de pedir algo ao servidor

const containerCuriosidades = document.getElementById('container_curiosidades'); // exibir curiosidades
const containerFavoritos = document.getElementById('container_favoritos'); // exibir itens favortitos
const filtroInput = document.getElementById('filtroInput'); // filtrar curiosidades
const carregandoCuriosidades = document.getElementById('carregando'); // indicador de caregamento = indica ao usuario que algo esta sendo procesaod

let curiosidades = []; // tds curiosidades da api
let filtradas = []; // tds curiosidades filtradas de acordo com filtroInput
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || []; // recuperar o item 'favoritos', sempre como string;
// se 'favoritos' não estiver no ls, variavel ==  array vazio == || [];
// JSON.parse() == de volta p array 'favoritos';

// localStorage.getItem('favoritos') == null: == JSON.parse(null) == null == problema;
// por isso: || [] (array vazia); 

// ls == armazenar em string;
// apos fechar aba/navegador ainda persiste;
// area no navegador p armanezar dados pares chave(nome)-valor;
// array == lista;
// null = nada;

let offset = 0; // onde começa a buscar curiosidades;
// 0 == começar do inicio;
// por isso: != carregar tds de  uma vez; 

const LIMIT = 5; // qntd max itens == 5 curiosidades por vez;

function fetchCuriosidades() { // busca de curiosidade na API;
    carregandoCuriosidades.classList.remove('hidden'); // remove 'hidden' do 'carregando';
    fetch(`${URL}?limit=${LIMIT}&offset=${offset}`) // requisição API (URL) = chamada assincrona; 2 parâmetros: limit (qnt itens) e offset (ondecomeça busca);

        .then(response => response.json()) 

        // processa a resposta da requisição == feita com fetch() == API retorna uma resposta(response);
        // converte a resposta em um formato JSON (objeto);
        // operação assíncrona == executar independente da execução de outras partes do codigo; == resultado retorna promise;

        // processamento da array retornadda
        .then(data => { // lidar dados da api; data == array curiosidades;
            curiosidades.push(...data); // 'curiosidades' == new array data; 
            // push == adiciona old array in final new array;
            // (...) == td de uma vez, sem criar new subarray
            offset += LIMIT; // garantir que limit funcione na prox requisição; 
            // offset == scroll infinito == carregar mais dados ao rolar, sem repetir ja carregados;
            filterCuriosities(); // chama a função 'filterCuriosities()' == aplica filtro de busca feita em filtroInput;
        })
        .catch(error => { // captura o erro;
            console.error('Erro no Servidor:', error); // exibe erro;
        })
        .finally(() => { // falhando ou não é executado;
            carregandoCuriosidades.classList.add('hidden'); //hidden é adicionada de volta;
        });
}

function displayCuriosidades(curiosidadesToDisplay) { // exibe curiosidades no DOM (parte visual da pag);
// 'curiosidadesToDisplay' == array curiosidades exibidas na tela;

    containerCuriosidades.innerHTML = ''; // limpa container;
    curiosidadesToDisplay.forEach((curiosidade, index) => { // para cada curiosidade == nova função executada no forEach == iteração == 'loop';
    // curiosidade == cada curiosidade no array;
    // index == indice de cada curiosidade no array;

        const id = index; // cria variavel id == recebe valor index;
        const isFavorito = favoritos.includes(id); // includes == retorna true se id in favoritos == false se id não estiver in favoritos;
        const div = document.createElement('div'); // cria new element div;
        div.classList.add('curiosidade-container'); // push classe no css para new div;
        div.innerHTML = `
            <h3>Curiosidade #${id + 1}</h3>
            <p>${curiosidade.text}</p>
            <button data-id="${id}" class="${isFavorito ? 'desfavoritar' : 'favoritar'}">
                ${isFavorito ? 'Desfavoritar' : 'Salvar como Favorito'}
            </button>
        `; // define conteudo da div;

// <h3> == push '1' ao id;
// <p> ==  txt curiosidade;
//button:
    // data-id="${id}" == armazena id da curiosidade no button;

    // class="${isFavorito ? 'desfavoritar' : 'favoritar'}" == define classe no css;

    // ?: == se o botão for == favoritar or == desfavoritar (com base valor de isFavorito);
        // true == desfavoritar ; false == favoritar;

    // ${isFavorito ? 'Desfavoritar' : 'Salvar como Favorito'} == txt no botão;

        const button = div.querySelector('button'); //busca elemnto button(na div) usando querySelector;
    // querySelector == metodo especifico dda api do dom; == seleciona elelmnetos do dom usando seletor css (button);
        button.onclick = (event) => toggleFavorito(event); // clicar no botao == 'toggleFavorito' sera chamado (passando evento clique como argumento); == adiciona ou remove curiosidade dos favoritos;
        containerCuriosidades.appendChild(div); // push div (curiosidade e botao) no 'containerCuriosidades' == exibe item na pag;
    });
    updateFavoritos(); // atualiza a lista de favortitos;
}

filtroInput.addEventListener('input', () => { // adicionar filtro;
// () => == arrow function == callback; == executa quando inputfor utilizado;
    filterCuriosities(); // chama a função 'filterCuriosities()' == aplica filtro de busca feita em filtroInput;
});

function filterCuriosities() { //filtrar curiosidades com base txt no inout;
    const filtro = filtroInput.value.toLowerCase(); //converter para letras minusculas;
    filtradas = curiosidades.filter(curiosidade => // chamar cada elemento do array curiosidades;
        curiosidade.text.toLowerCase().includes(filtro) // determina se a curiosidade devvr ser incluida no array filtradas;
    // curiosidade.text == txt da curiosidade;
    // tolowercase == garantir txt minusculo;
    // includes(filtoro) == txt == string digitada;
    // if true == curiosidades push 'filtradas';
    );
    displayCuriosidades(filtradas); // chama a função 'siplaycurisidades' passando array 'filtradas' como argumento;
}

function toggleFavorito(event) { // new function 'toggleFavorito' == parametro 'event' == click botão fav/desfav;
    const id = parseInt(event.target.dataset.id);
    // parseint == converter str em n int == identificar cuiriosidades nos arrays de fav;
    // event.target == botão clicado (elemento q acionou o evento)
    // dataset.id == acessa data-id(id da curiosidade) do botao;
    const button = event.target; // armazena o botao (elemento q acionou o evento)

    if (favoritos.includes(id)) { // verifica se id ja etsa na array
        favoritos = favoritos.filter(favorito => favorito !== id); //executa ser for true
        // filter == new array with all fav, except os que tem id correspondent; == remove curiosidade da lista de fav;
        button.textContent = 'Salvar como Favorito'; // altera text botão se for desfav;
        button.classList.remove('desfavoritar');  //remov css desfavoritar
        button.classList.add('favoritar'); //add css favortitar
    } else { // id não esta na array
        favoritos.push(id); //adiciona id a fav;
        button.textContent = 'Desfavoritar'; // altera text  botao se for fav;
        button.classList.remove('favoritar'); // remove css favoritar;
        button.classList.add('desfavoritar'); // adiciona css desfav;
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos)); //armazena array atualizada de fav no ls do navegador;
    //json.stringify() == coonverte array de fav em uma str (ls so aceita dado str);
    // setitem() == armazena string com a chave 'favoritos'
    updateFavoritos(); //chama a função 'updatefav'
}

function updateFavoritos() { // atualiza e exibe as curiosidades que foram marcadas como fav;
    containerFavoritos.innerHTML = ''; // limpa container;
    if (favoritos.length === 0) { //verificar se lista 'favoritos' esta vazia;
        containerFavoritos.innerHTML = '<p>Nenhuma curiosidade favorita ainda.</p>'; //text se estiver vazia;
    } else { // se tiver fav;
        favoritos.forEach(id => { // para cada curiosidade == nova função executada no forEach == iteração == 'loop';
    // favorios == cada item no array;
    // id == id de cada curiosidade no array;
            const curiosidade = curiosidades[id]; //recupera a curiosidade do id; == retorna obj d curiosidade do id;
            if (curiosidade) { //verifica se a curiosidade exiyse;
                const div = document.createElement('div'); //cria new div
                div.classList.add('curiosidade-favorita'); //push classe no css p new div;
                div.innerHTML = `
                    <h3>Curiosidade #${id + 1}</h3>
                    <p>${curiosidade.text}</p>
                    <button data-id="${id}" class="desfavoritar">Desfavoritar</button>
                `;// define conteudo da div;
// <h3> == push '1' ao id;
// <p> ==  txt curiosidade;
// data-id="${id}" == armazena id da curiosidade no button;
                const button = div.querySelector('button'); //busca elemnto button(na div) usando querySelector;
                // querySelector == metodo especifico dda api do dom; == seleciona elelmnetos do dom usando seletor css (button);
                button.onclick = (event) => toggleFavorito(event); // clicar no botao == 'toggleFavorito' sera chamado (passando evento clique como argumento); == adiciona ou remove curiosidade dos favoritos;
                containerFavoritos.appendChild(div); // push div (curiosidade e botao) no 'containerCuriosidades' == exibe item na pag;
            }
        });
    }
}

window.addEventListener('scroll', () => {  //evento de scroll
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement; //captura o valor atual da rolagem + alturaa da pag, para deterianr posição scroll
    // scrolltop == qntd pixels conteudo foi rolado a parti do topo;
    //clientheigth == altura area visivel da janela;
    // scollheighy == altura total do ontuedo da pag (incluindo oq precisa ser tolado p ser visto);

    if (scrollTop + clientHeight >= scrollHeight - 5) { // verifica se o usuarii chefou perto do final da oag;
    // posição scroll + altura visivel janela >= altura total da pag - 5px
    // if true == perto ou final da pag (5px de tolerancia);
        fetchCuriosidades(); // chama fetchcuriosidades qnd usuario chega ao fim da pag;
        //fetchcuriosidades == requisição carregar mais curiosidades sobre gatos == scroll infinito == novos dados sao carregados confotme o usuatiro rola para o final da pag;
    }
});

fetchCuriosidades(); // chama a função 'fetchCuriosidades' para curiosidades sejam carregadas imediatamente ao carregar a pag, para n precisar rolar ate o fim; == reuqisição == exibir primeiras curiosidades no inicio da pag;
updateFavoritos(); //chama a ufnção 'updateFavoritos' == att  alista d efav assim q a pag é carregada == itens ja salvos sejam exbidios dps de carregar a pag;