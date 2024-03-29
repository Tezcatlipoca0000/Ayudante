
// ********  METHODS  ********

const add = {
	'attr': (x, attr) => {
		for (let i of attr) x.setAttribute(i[0], i[1]);
	},
	'listener': (x, listener) => {
		for (let i of listener) x.addEventListener(i[0], i[1], false);
	},
	'el': (el, where, what, attr, listener) => {
		let x = document.createElement(el);
		if (what) x.innerText = what;
		if (attr) add.attr(x, attr);
		if (listener) add.listener(x, listener);
		document.querySelector(where).appendChild(x);
	},
	// returns a string 'dd/mm/yyyy'
	'date': () => {
		let x = new Date(),
			day = x.getDate(),
			month = x.getMonth() + 1,
			year = x.getFullYear(),
			today;
		if (day < 10) day = '0' + day;
		if (month < 10) month = '0' + month;
		today = `${day}/${month}/${year}`;
		return today;
	},
	'ticks': (where, which) => {
		for (let i of where) {
			for (let j of which) {
				if (i.labels[0].innerText === j) i.checked = true;
			}	
		}
	},
	'menu': (id, arr) => {
		// investigate DIALOG html element 
		// is FORM element a good idea here?
		// ex. >>> add.menu(id-for-menu, [['Title1', 'id-for-grid-1', 'id-for-flex-1'], ['Title2', 'id-for-grid-2', 'id-for-flex-2']]);
		let menu = document.querySelector('.menu'),
			log = document.querySelector('#logMenu');
		if (menu && !log) menu.remove();
		add.el('div', 'body', '', [['class', 'menu'], ['id', id]]);
		for (let [i, n] of arr.entries()) {
			add.el('h2', `#${id}`, n[0]);
			add.el('form', `#${id}`, '', [['id', `form-${id}${i}`]])
			add.el('div', `#form-${id}${i}`, '', [['class', 'grid1'], ['id', n[1]]]);
			add.el('br', `#form-${id}${i}`);
			add.el('div', `#form-${id}${i}`, '', [['class', 'btnsMidRow'], ['id', n[2]]]);
		}
	},
	'cancel': (where) => {
		document.querySelector(where).remove();
	},
	// sorts table rows asc or desc
	'sort': (th) => {
		let data = th.dataset.col,
			rows = document.querySelector('.table').rows,
			switching = true,
			i,
			a,
			b,
			shouldSwitch,
			dir = 'asc',
			switchcount = 0,
			re1 = /\$/,
			re2 = /%/;
		while (switching) {
			switching = false;
			for (i = 1; i < (rows.length - 1); i++) {
				shouldSwitch = false;
				a = rows[i].querySelector(`[data-col=${data}]`).innerText;
				b = rows[i + 1].querySelector(`[data-col=${data}]`).innerText;
				if (re1.test(a)) {
					a = a.replace('$', '');
					b = b.replace('$', '');
				}
				if (re2.test(a)) {
					a = a.replace('%', '');
					b = b.replace('%', '');
				}
				if (Number.isNaN(Number(a))) {
					if (dir === 'asc') {
						if (a.toLowerCase() > b.toLowerCase()) {
							shouldSwitch = true;
							break;
						}
					} else if (dir === 'desc') {
						if (a.toLowerCase() < b.toLowerCase()) {
							shouldSwitch = true;
							break;
						}
					}
				} else {
					if (dir === 'asc') {
						if (Number(a) > Number(b)) {
							shouldSwitch = true;
							break;
						}
					} else if (dir === 'desc') {
						if (Number(a) < Number(b)) {
							shouldSwitch = true;
							break;
						}
					}
				}	
			}
			if (shouldSwitch) {
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
				switchcount++;
			} else {
				if (switchcount === 0 && dir === 'asc') {
					dir = 'desc';
					switching = true;
				}
			}
		}
	},
	// A question icon
	'icons': (where) => { 
		let x = document.querySelectorAll(where);
		for (let i of x) {
			const svgns = 'http://www.w3.org/2000/svg';
			let path1 = document.createElementNS(svgns, 'path'),
				path2 = document.createElementNS(svgns, 'path'),
				svg = document.createElementNS(svgns, 'svg');
			svg.setAttribute('class', 'question-svg');
			svg.setAttribute('width', '16px');
			svg.setAttribute('height', '16px');
			svg.setAttribute('fill', 'currentColor');
			svg.setAttribute('viewBox', '0 0 16 16');
			path1.setAttribute('d', 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z');
			path2.setAttribute('d', 'M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z');
			svg.appendChild(path1);
			svg.appendChild(path2);
			i.appendChild(svg);
		}
	},
	// forces input to validate
	'inputValidation': (target) => {
		let re1 = /\$/g,
			re2 = /[-#!%^&*()_+|~=`{}\[\]:";'<>?,\/a-zA-Z]|\.{2,}|\${2,}/g,
			re3 = /[-#!%^&*()_+|~=`{}\[\]:";'<>?,\/a-zA-Z\.\$]/g,
			re4 = /[-#!%^&*()_+|~=`{}\[\]:";'<>?,\/a-zA-Z\$]|\.{2,}/g,
			re5 = /^=\d+$/,
			txt = target.innerText,
			col = target.dataset.col,
			tst1 = re1.test(txt), 
			tst2 = re2.test(txt), 
			tst3 = re3.test(txt), 
			tst4 = re4.test(txt), 
			tst5 = re5.test(txt); // referer test
		switch (col) {
			case 'subtotal': case 'publico': case 'biblia': // inforce correct format (ex. $10.00)
			let reg = target.parentElement.dataset.registro;
				if (tst5) {
					let ref = txt.replace('=', ''),
						data = (db.state.filter(n => n.registro === ref))[0];
					db.state = db.state.map(n => {
						if (n.registro === reg) n.refer = {[col]: ref};
						return n
					});
					txt = data[col]
				} else {
					// remove symbols, characters, more that two . or $
					if (tst2) {
						txt = txt.replaceAll(re2, '');
					}
					// put $ in right place
					if (tst1 && txt[0] !== '$') {
						txt = txt.replaceAll(re1, '');
					} 
					// insert $ if inexistant
					if (!tst1) {
						txt = `$${txt}`;
					} 
					txt = `$${Number(txt.replace('$', '')).toFixed(2)}`;
					db.state = db.state.map(n => {
						if (n.registro === reg && n.refer && n.refer[col]) delete n.refer;
						return n;
					});
				}
				target.innerText = txt;
				break;
			case 'pedido': //numers (whole/decimal)
				if (tst4) {
					txt = txt.replaceAll(re4, '');
					target.innerText = txt;
				}
				break;
			case 'producto': case 'claveFuentes': //everything's allowed
				break;
			default: //numbers (whole)
				if (tst3) {
					txt = txt.replaceAll(re3, '');
					target.innerText = txt;
				}
				break;
		}
	},
	// MOVE THIS TO DATOS
	'class': (str) => {
		let x = Array.from(document.querySelectorAll('.mainBtn')).slice(0,-1);
		let y = document.querySelector('.mainBtn:last-child');
		console.log(y);
		for (let i of x) {
			i.classList.toggle(str);
		}
		if (y.innerText === 'Mostrar Opciones') {
			y.innerText = 'Ocultar Opciones';
		} else {
			y.innerText = 'Mostrar Opciones'
		}
	},
}; 

const calc = {
	// [subtotal, iva, ieps] >>>> calc.total([10, 1.8, 1.2]) >>> '$13.00'
	'total': (nums) => {
		let x = (nums.reduce((a,b)=>a+b)).toFixed(2);
		return `$${x}`
	},
	// unitario [total, piezas] 
	'unitario': (nums) => {
		let x = (nums[0] / nums[1]).toFixed(2);
		return `$${x}`
	},
	// [publico, unitario]
	'margen': (nums) => {
		let x = (((nums[0] - nums[1]) / nums[1]) * 100).toFixed(2);
		return `${x}%`
	},
	// diferenciaB [unitario, biblia] > utilUnit [publico, unitario]
	'sub': (nums) => {
		let x = (nums[0] - nums[1]).toFixed(2);
		return `$${x}`
	},
	// utilP [piezas, utilidadUnitaria], iva [sub, IVA], ieps [sub, IEPS]
	'mult': (nums) => {
		let x = (nums[0] * nums[1]).toFixed(2);
		return `$${x}`
	},
};

const update = {
	// updates db when changes has been made
	'db': (reg, col, txt, date = false) => {
		backUp = ((db.hist.filter(n => n.registro == reg))[0])[col]
		db.state = db.state.map(n => {
			if (n.registro === reg) {
				if (col === 'iva') {
					n.iva = n.iva === '$0.00' ? calc.mult([Number(n.subtotal.replace('$', '')), IVA]) : '$0.00';
				} else if (col === 'ieps') {
					n.ieps = n.ieps === '$0.00' ? calc.mult([Number(n.subtotal.replace('$', '')), IEPS]) : '$0.00';
				} else {
					n[col] = txt;
				}
				if (n[col] !== backUp) date = true;
				switch(col) {
					case 'subtotal': case 'iva': case 'ieps': case 'piezas':
						// iva ieps total uni margen utu utp revC difB
						if (n.iva !== '$0.00') n.iva = calc.mult([Number(n.subtotal.replace('$', '')), IVA]);
						if (n.ieps !== '$0.00') n.ieps = calc.mult([Number(n.subtotal.replace('$', '')), IEPS]);
						n.total = calc.total([Number(n.subtotal.replace('$', '')), Number(n.iva.replace('$', '')), Number(n.ieps.replace('$', ''))]);
						n.unitario = calc.unitario([Number(n.total.replace('$', '')), Number(n.piezas)]);
						n.margen = calc.margen([Number(n.publico.replace('$', '')), Number(n.unitario.replace('$', ''))]);
						n.margenB = calc.margen([Number(n.publico.replace('$', '')), Number(n.biblia.replace('$', ''))]);
						n.utilidadUnitaria = calc.sub([Number(n.publico.replace('$', '')), Number(n.unitario.replace('$', ''))]);
						n.utilidadPedido = calc.mult([Number(n.piezas), Number(n.utilidadUnitaria.replace('$', ''))]);
						n.revCostos = date ? add.date() : n.revCostos;
						n.diferenciaB = calc.sub([Number(n.unitario.replace('$', '')), Number(n.biblia.replace('$', ''))]);
						break;
					case 'publico':
						// margen, utu utp revP
						n.margen = calc.margen([Number(n.publico.replace('$', '')), Number(n.unitario.replace('$', ''))]);
						n.margenB = calc.margen([Number(n.publico.replace('$', '')), Number(n.biblia.replace('$', ''))]);
						n.utilidadUnitaria = calc.sub([Number(n.publico.replace('$', '')), Number(n.unitario.replace('$', ''))]);
						n.utilidadPedido = calc.mult([Number(n.piezas), Number(n.utilidadUnitaria.replace('$', ''))]);
						n.revPrecios = date ? add.date() : n.revPrecios;
						break;
					case 'biblia':
						// difB
						n.diferenciaB = calc.sub([Number(n.unitario.replace('$', '')), Number(n.biblia.replace('$', ''))]);
						n.margenB = calc.margen([Number(n.publico.replace('$', '')), Number(n.biblia.replace('$', ''))]);
						break;
					case 'limite':
						n.limite = txt;
						break;
					default:
						break;
				}
				return n;
			} else {
				return n;
			}
		});
	},
	// updates table rows with db info
	'row': (td, row) => {
		let reg = row.dataset.registro,
			data = (db.state.filter(n => n.registro === reg))[0],
			col = td.dataset.col;
		// if columnm is limite don't update row
		if (col === 'limite') {
			return
		} else if (col === 'pedido') {
			// if column is pedido calculate total
			for (let i of row.cells) {
				if (i.dataset.col === 'total') {
					i.innerText = `$${Number(td.innerText) * Number(data.total.replace('$', ''))}`;
				}
			}
		} else {
			// all other columns use db to update cells
			for (let i of row.cells) {
				if (data.hasOwnProperty(i.dataset.col)) i.innerText = data[i.dataset.col];
			}
		}
		// only for DATOS update references 
		if (main.state === 'navDatos') {
			update.refs(td, reg);
		}
	},
	// updates total column
	'col': () => {
		let col = document.querySelectorAll('td[data-col="total"]'),
			x = 0,
			td = document.querySelector('tfoot tr td:last-child');
		col.forEach(n => x += Number(n.innerText.replace('$', '')));
		td.innerText = `$${x.toFixed(2)}`;
	}, 
	// add ticks and update boxes ----- needs revition
	'boxes': (evt) => { 
		let boxes = document.querySelectorAll('.menu input[type="checkbox"]'),
			target = evt.target.innerText;
		for (let i of boxes) i.checked = false;
		switch(target) {
			case 'Costos':
				add.ticks(boxes, keys.datosCostos);
				break;
			case 'Precios':
				add.ticks(boxes, keys.datosPrecios);
				break;
			case 'Aumentos':
				add.ticks(boxes, keys.datosAumentos);
				break;
			case 'Biblia':
				add.ticks(boxes, keys.datosBiblia);
			default:
				break;
		}
	},
	// update db & table for references
	'refs': (td, reg) => {
		// loop db
		db.state.forEach(n => {
			// if db record matches column and reg with td
			if (n.refer && n.refer[td.dataset.col] === reg) {
				let rows = td.parentElement.parentElement.rows,
					referTo = n.registro;
				// update db record
				update.db(referTo, td.dataset.col, td.innerText);
				// loop existing table
				for (let i of rows) {
					// if table row registry matches referTo
					if (i.dataset.registro === referTo) {
						// update row
						update.row(i.cells[0], i);
					}
				}
			}
		});
	},
};

const save = {
	'origin': '',
	'state': '',
	'info': () => {
		db.origin === 'SERVER' ? save.post() : save.file();
	},
	'file': () => {
		let url = null,
			data = JSON.stringify(db.state),
			file = new Blob([data], {type: 'octet/stream'}),
			prompt = document.querySelector('.promptSm');
		if (url !== null) window.URL.revokeObjectURL(url);
		url = window.URL.createObjectURL(file);
		add.el('a', 'body', '', [['display', 'none'], ['href', url], ['download', 'datos.json'], ['id', 'downloadLink']]);
		document.querySelector('#downloadLink').click();
		document.querySelector('#downloadLink').remove();
		if (prompt) add.cancel('.promptSm');
	},
	'post': (data) => {
		if (!data) {
			data = db.state;
			save.origin = 'update';
		} else {
			save.origin = 'backup';
		}
		let xhr = new XMLHttpRequest(),
			url = 'http://192.168.1.131:80';
		xhr.open('POST', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Ayudante', 'True');
		add.listener(xhr, [['error', save.postErr], ['load', save.postSuccess]]);
		xhr.send(JSON.stringify(data));
	},
	'postErr': () => {
		save.state = 'err';
		save.origin === 'update' ? save.promptDisk() : alert('Ocurrió un error al intentar guardar la información, por favor vuelva a intentarlo')
	},
	'postSuccess': () => {
		save.state = 'success';
		save.origin === 'update' ? save.promptDisk() : alert('Se guardó la información en el servidor correctamente')
	},
	'promptPost': () => {
		add.el('div', 'body', '', [['class', 'promptSm']]);
		add.el('span', '.promptSm', '¡Atención! El archivo seleccionado se utilizará para sobreescribir toda la información del servidor.');
		add.el('input', '.promptSm', '', [['type', 'file'], ['id', 'promptSm-input']]);
		add.el('div', '.promptSm', '', [['class', 'btnsMidRow']]);
		add.el('button', '.promptSm .btnsMidRow', 'Aceptar', '', [['click', () => db.load('promptSm-input')]]);
		add.el('button', '.promptSm .btnsMidRow', 'Cancelar', '', [['click', () => add.cancel('.promptSm')]]);
	},
	'promptDisk': () => {
		let txt = save.state === 'err' ? 'Ocurrió un error y NO se guardó la información, por favor vuelva a intentarlo' : 'Se guardó la información en el servidor correctamente';
		add.el('div', 'body', '', [['class', 'promptSm']]);
		add.el('span', '.promptSm', txt);
		add.el('span', '.promptSm', 'También puede crear una copia de la información y guardarla en su disco');
		add.el('div', '.promptSm', '', [['class', 'btnsMidRow']]);
		add.el('button', '.promptSm .btnsMidRow', 'Guardar una copia en mi disco', '', [['click', save.file]]);
		add.el('button', '.promptSm .btnsMidRow', 'Continuar sin guardar una copia', '', [['click', () => add.cancel('.promptSm')]]);
		if (save.state === 'err') document.querySelector('.promptSm').setAttribute('style', 'border-color:red;');
	},
	'newPedido': () => {
		// if pedido info is empty then save db (in case limite has been mod)
		// if pedido info is present generate log(with pedido), push log to history, save db
		let pedido = document.querySelectorAll('td[data-col="pedido"]'),
			producto = document.querySelectorAll('td[data-col="producto"]'),
			total = document.querySelectorAll('td[data-col="total"]'),
			_total = document.querySelector('tfoot td:last-child'),
			empty = true,
			cant = [],
			prod = [],
			tot = [],
			prov = main.prov,
			today = add.date();
		pedido.forEach(n => {
			cant.push(n.innerText);
			if(n.innerText !== '' && n.innerText !== '0') empty = false;
		});
		if (empty) {
			save.info()
		} else {
			producto.forEach(n => prod.push(n.innerText));
			total.forEach(n => tot.push(n.innerText));
			const newLog = new Log([[prod], [cant], [tot], _total.innerText]);
			if (!db.state[db.state.length-1].historial.hasOwnProperty(prov)) {
				db.state[db.state.length-1].historial[prov] = [];
			}
			db.state[db.state.length-1].historial[prov].unshift({[today]: newLog});
			// if [prov] has 11 logs delete the oldest
			if (db.state[db.state.length-1].historial[prov].length > 10) {
				db.state[db.state.length-1].historial[prov].pop();
			}
			save.info();
		}
	},
};

class Reg {
	constructor(arr) {
		let tot = calc.total([arr[2], arr[3], arr[4]]),
			uni = calc.unitario([Number(tot.replace('$', '')), arr[6]]),
			mar = calc.margen([arr[5], Number(uni.replace('$', ''))]),
			uu = calc.sub([arr[5], Number(uni.replace('$', ''))]),
			up = calc.mult([arr[6], Number(uu.replace('$', ''))]);
		this.registro = arr[0];
		this.provedor = main.prov; 
		this.producto = arr[1];
		this.subtotal = `$${arr[2].toFixed(2)}`;
		this.unitario = uni;
		this.iva = `$${arr[3].toFixed(2)}`;
		this.ieps = `$${arr[4].toFixed(2)}`;
		this.total = tot;
		this.publico = `$${arr[5].toFixed(2)}`;
		this.margen = mar;
		this.utilidadUnitaria = uu;
		this.utilidadPedido = up;
		this.piezas = arr[6];
		this.costosAnt = '--'; //
		this.diferenciaC = '--'; //
		this.margenAnt = '--'; //
		this.diferenciaM = '--'; //
		this.revCostos = add.date();
		this.revPrecios = add.date();
		this.claveProv = arr[7] === '' ? '--' : arr[7];
		this.barras = arr[8] === '' ? '--' : arr[8];
		this.biblia = uni;
		this.diferenciaB = '$0.00'; 
		this.margenB = mar;
		this.claveFuentes = arr[9] === '' ? '--' : arr[9];
	}
}

class Log {
	constructor(arr) {
		this.producto = arr[0];
		this.cantidad = arr[1];
		this.total = arr[2];
		this._total = arr[3];
	}
}

// ******** GLOBAL VARIABLES && CONSTANTS *******

let globalTimeout = null;

const IVA = 0.16,
	IEPS = 0.08;

const keys = {
	'all': ['registro', 'provedor', 'producto', 'subtotal', 'unitario', 'iva', 'ieps', 'total', 'publico', 'margen', 'utilidadUnitaria', 'utilidadPedido', 'piezas', 'costosAnt', 'diferenciaC', 'margenAnt', 'diferenciaM', 'revCostos', 'revPrecios', 'claveProv', 'barras', 'claveFuentes', 'biblia', 'diferenciaB', 'margenB'],
	'money': ['subtotal', 'unitario', 'iva', 'ieps', 'total', 'publico', 'utilidadUnitaria', 'utilidadPedido', 'costosAnt', 'diferenciaC', 'biblia', 'diferenciaB',],
	'money2': ['subtotal', 'unitario', 'iva', 'ieps', 'total', 'publico', 'utilidadUnitaria', 'utilidadPedido', 'biblia', 'diferenciaB',],
	'percent': ['margen', 'margenAnt', 'margenB'],
	'datosKeys': ['registro', 'producto', 'subtotal', 'unitario', 'iva', 'ieps', 'total', 'publico', 'margen', 'utilidadUnitaria', 'utilidadPedido', 'piezas', 'revCostos', 'revPrecios', 'claveProv', 'barras', 'claveFuentes', 'biblia', 'diferenciaB', 'margenB'],
	'datosHeaders': ['No. Registro', 'Producto', 'Subtotal', 'Costo Unitario', 'Iva', 'Ieps', 'Total', 'Precio al Público', 'Margen', 'Utilidad Unitaria', 'Utilidad por Pedido', 'Piezas', 'Última rev. Costos', 'Última rev. Precios', 'Clave Provedor', 'Código de Barras', 'Código Super Fuentes', 'Biblia', 'Diferencia B', 'Margen B'],
	'datosCostos': ['No. Registro', 'Producto', 'Subtotal', 'Costo Unitario', 'Total', 'Última rev. Costos', 'Clave Provedor', 'Código de Barras', 'Código Super Fuentes', 'Biblia', 'Diferencia B'],
	'datosPrecios': ['No. Registro', 'Producto', 'Costo Unitario', 'Precio al Público', 'Margen', 'Última rev. Precios', 'Código de Barras', 'Código Super Fuentes', 'Biblia', 'Diferencia B'],
	'datosAumentos': ['Producto', 'Costo Unitario', 'Precio al Público', 'Margen', 'Diferencia B'],
	'datosBiblia': ['Producto', 'Biblia', 'Precio al Público', 'Margen B'],
	'uniqueProv': () => {
		let provedoresList = [];
		for(let i of db.state) {
			provedoresList.push(i.provedor);
		}
		return [...new Set(provedoresList)];
	},
	'pedidoHeaders': ['Producto', 'Límite', 'Pedido', 'Total'],
};

// ********  SITE  *********

const compare = {
	search: () => {
		let table = document.querySelector('.table'),
			mainBtnRow = document.querySelector('.mainBtnRow');
		if (table) table.remove();
		if (mainBtnRow) mainBtnRow.remove();
		add.el('input', '#main', '', [['id', 'compareSearch']]);
		add.el('button', '#main', 'Comparar', null, [['click', compare.lookup]])
	},
	lookup: () => {
		let x = document.querySelector('#compareSearch'),
			url = 'http://192.168.1.131:80/compare';
		console.log('heyyy', x);
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Ayudante': 'True',
			},
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({product: x.value}),
		})
		.then(response => response.json())
		.then(data => {
			console.log("Here's the server's response: ", data);
			if (data.error) {
				alert('Hubo un error y NO se envió la información. Porfavor vuelva a intentarlo.')
			} else {
				alert('¡Se envió la información éxitosamente!');
				//add.cancel('#histSendMenu')
			}
		})
		.catch((err) => {
			console.error('There was an error making the connection to the server: ', err);
			alert('Hubo un error estableciendo la conexión con el servidor. Porfavor vuelva a intentarlo.');
		});
	},
};

const cobrar = {
	table: () => {
		console.log('heyyyy', main.prov);
		let table = document.querySelector('.table'),
			mainBtnRow = document.querySelector('.mainBtnRow');
		if (table) table.remove();
		if (mainBtnRow) mainBtnRow.remove();
		add.el('div', '#main', '', [['class', 'cobrarBG']]);
		add.el('div', '.cobrarBG', '', [['class', 'cobrarINPUT']]);
		add.el('label', '.cobrarINPUT', 'Código del producto:');
		add.el('input', '.cobrarINPUT');
	},
};

const hist = {
	table: () => {
		let table = document.querySelector('.table'),
			mainBtnRow = document.querySelector('.mainBtnRow'),
			data = db.state[db.state.length-1].historial[main.prov];
		if (table) table.remove();
		if (mainBtnRow) mainBtnRow.remove();
		if (!data) return;
		add.el('table', '#main', '', [['class', 'table'], ['id', 'historialTable']]);
		add.el('thead', '#historialTable', '', [['id', 'historialThead']]);
		add.el('tbody', '#historialTable', '', [['id', 'historialTbody']]);
		add.el('tr', '#historialThead', '', [['id', 'historialHead']]);
		add.el('th', '#historialHead', 'Fecha');
		add.el('th', '#historialHead', 'Total');
		for (let [i, n] of data.entries()) {
			add.el('tr', '#historialTbody', '', [['id', `historialTr${i}`]]);
			add.el('td', `#historialTr${i}`, '', [['class', 'noteditable'], ['id', `historialLog${i}`]]);
			add.el('a', `#historialLog${i}`, (Object.keys(n))[0], [['href', '#main']], [['click', () => hist.log(n)]]);
			add.el('td', `#historialTr${i}`, n[(Object.keys(n))[0]]._total, [['class', 'noteditable']]);
		}
	},
	log: (data) => {
		let key = (Object.keys(data))[0],
			idx = [],
			cant = data[key].cantidad[0].filter((n, i) => {
				if (n !== '') {
					idx.push(i);
					return true;
				}
			}),
			tot = data[key].total[0].filter(n => n !== ''),
			prod = data[key].producto[0].filter((n, i) => {
				for (let j of idx) {
					if (i === j) return true;
				}
			}),
			_tot = data[key]._total;
		add.el('div', 'body', '', [['class', 'menu'], ['id', 'logMenu']]);
		add.el('div', '#logMenu', '', [['class', 'mainBtnRow']]);
		add.el('button', '#logMenu .mainBtnRow', 'Enviar', [['class', 'mainBtn']], [['click', () => {if (!document.querySelector('#histSendMenu')) hist.sendMenu()}]]);
		add.el('button', '#logMenu .mainBtnRow', 'Cerrar', [['class', 'mainBtn']], [['click', () => {if (!document.querySelector('#histSendMenu')) add.cancel('#logMenu')}]]);
		add.el('table', '#logMenu', '', [['class', 'table'], ['id', 'logTable']]);
		add.el('thead', '#logTable');
		add.el('tbody', '#logTable');
		add.el('tfoot', '#logTable');
		add.el('tr', '#logTable thead');
		add.el('th', '#logTable thead tr', 'Producto');
		add.el('th', '#logTable thead tr', 'Pedido');
		add.el('th', '#logTable thead tr', 'Total');
		for (let [i, n] of cant.entries()) {
			add.el('tr', '#logTable tbody', '', [['id', `logTr${i}`]]);
			add.el('td', `#logTr${i}`, prod[i], [['class', 'noteditable'], ['data-col', 'producto']]); 
			add.el('td', `#logTr${i}`, n, [['class', 'noteditable'], ['data-col', 'pedido']]); 
			add.el('td', `#logTr${i}`, tot[i], [['class', 'noteditable'], ['data-col', 'total']]); 
		}
		add.el('tr', '#logTable tfoot');
		add.el('td', '#logTable tfoot tr', 'Total');
		add.el('td', '#logTable tfoot tr', _tot);
	},
	// captures mail address to send pedido
	sendMenu: () => {
		// TODO flash sendMenu's border-box when trying to close behind-menu before allowed
		// MAYBE: try >> make a GET '/send' req the email addrs. catch >> err. finally >> set value attribute.
		add.menu('histSendMenu', [['Enviar pedido a:', 'histSendGrid', 'histSendFlex']]);
		add.el('label', '#histSendGrid', 'Dirección de correo:');
		add.el('input', '#histSendGrid', '', [['value', 'superfuentes300@gmail.com']]);
		add.el('i', '#histSendGrid', null, [['class', 'sendMnuSvg'], ['title', 'Escriba una o varias direcciones separadas por una coma']]);
		add.icons('.sendMnuSvg');
		add.el('button', '#histSendFlex', 'Cancelar', '', [['click', () => add.cancel('#histSendMenu')]]);
		add.el('button', '#histSendFlex', 'Enviar', [['type', 'button']], [['click', hist.send]]);
	},
	// send pedido to provider using nodemailer
	send: () => {
		let addr = document.querySelector('#histSendGrid input').value,
			tbl = document.querySelector('.menu .table'),
			url = 'http://192.168.1.131:80/send';
		add.el('div', 'body', null, [['class', 'invisible']]);
		// make a table to send that excludes total row and col
		add.el('table', '.invisible', null, [['id', 'sendTbl']]);
		for (let i = 0; i < tbl.rows.length - 1; i++) {
			add.el('tr', '#sendTbl', '', [['id', `sendtr${i}`]]);
			add.el('td', `#sendtr${i}`, tbl.rows[i].cells[0].innerText);
			add.el('td', `#sendtr${i}`, tbl.rows[i].cells[1].innerText);
		}
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Ayudante': 'True',
			},
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({to: addr, html: document.querySelector('#sendTbl').outerHTML}),
		})
		.then(response => response.json())
		.then(data => {
			console.log("Here's the server's response: ", data);
			if (data.error) {
				alert('Hubo un error y NO se envió la información. Porfavor vuelva a intentarlo.')
			} else {
				alert('¡Se envió la información éxitosamente!');
				add.cancel('#histSendMenu')
			}
		})
		.catch((err) => {
			console.error('There was an error making the connection to the server: ', err);
			alert('Hubo un error estableciendo la conexión con el servidor. Porfavor vuelva a intentarlo.');
		});
		add.cancel('.invisible');
	},
};

const pedido = {
	// render pedidos table
	table: (h) => {
		let table = document.querySelector('.table'),
			mainBtnRow = document.querySelector('.mainBtnRow');
		if (table) table.remove();
		if (mainBtnRow) mainBtnRow.remove();
		add.el('div', '#main', '', [['class', 'mainBtnRow'], ['id', 'pedidoBtnRow']]);
		add.el('button', '#pedidoBtnRow', 'Guardar', [['class', 'mainBtn']], [['click', save.newPedido]]);
		add.el('table', '#main', '', [['class', 'table'], ['id', 'pedidoTable']]);
		add.el('thead', '#pedidoTable', '', [['id', 'pedidoThead']]);
		add.el('tbody', '#pedidoTable', '', [['id', 'pedidoTbody']]);
		add.el('tr', '#pedidoThead', '', [['id', 'pedidoHead']]);
		for (let i of h) add.el('th', '#pedidoHead', i);
		for (let [i, n] of db.state.entries()) {
			if (n.provedor === main.prov) {	
				add.el('tr', '#pedidoTbody', '', [['id', 'pedidoTr' + i], ['data-registro', n.registro]]);
				add.el('td', `#pedidoTr${i}`, n.producto, [['class', 'noteditable'], ['data-col', 'producto']]);
				add.el('td', `#pedidoTr${i}`, n.limite === undefined ? '' : n.limite, [['class', 'contenteditable'], ['contenteditable', 'true'], ['data-col', 'limite']]);
				add.el('td', `#pedidoTr${i}`, '', [['class', 'contenteditable'], ['contenteditable', 'true'], ['data-col', 'pedido']]);
				add.el('td', `#pedidoTr${i}`, '', [['class', 'noteditable'], ['data-col', 'total']]);
			}
		}
		add.el('tfoot', '#pedidoTable', '', [['id', 'pedidoTfoot']]);
		add.el('tr', '#pedidoTfoot', '', [['id', 'pedidoFoot']]);
		add.el('td', '#pedidoFoot', 'Total');
		add.el('td', '#pedidoFoot', '', [['id', 'pedidoTotal']]);		 
	},
	// on td input: update db and/or table 
	'update': (td) => {
		let row = td.parentElement,
			reg = row.dataset.registro,
			input = td.innerText,
			col = td.dataset.col;
		add.inputValidation(td);
		update.db(reg, col, input);
		update.row(td, row); 
		update.col();				
	},
};

const datos = {
	// renders datos table
	'table': (h, k) => {
		let table = document.querySelector('.table'),
			mainBtnRow = document.querySelector('.mainBtnRow'),
			x = 0,
			q = '#main',
			q2 = '#datosBtnRow',
			q3 = '#datosTable';
		if (table) table.remove();
		if (mainBtnRow) mainBtnRow.remove();
		add.el('div', q, '', [['class', 'mainBtnRow'], ['id', 'datosBtnRow']]);
		add.el('button', q2, 'Guardar', [['class', 'mainBtn']], [['click', save.info]]);
		add.el('button', q2, 'Filtrar', [['class', 'mainBtn']], [['click', datos.filterMenu]]);
		add.el('button', q2, 'Agregar', [['class', 'mainBtn']], [['click', datos.newMenu]]);
		add.el('button', q2, 'Eliminar', [['class', 'mainBtn']], [['click', datos.removeMenu]]);
		add.el('button', q2, 'Imprimir', [['class', 'mainBtn']], [['click', datos.print]]);
		add.el('button', q2, 'Mostrar Opciones', [['class', 'mainBtn invisible'], ['id', 'responsive']], [['click', ()=>add.class('mainBtnResp')]]);
		add.el('table', q, '', [['class', 'table'], ['id', 'datosTable']]);
		add.el('thead', q3, '', [['id', 'datosThead']]);
		add.el('tbody', q3, '', [['id', 'datosTbody']]);
		add.el('tr', '#datosThead', '', [['id', 'datosHead']])
		for (let [i, n] of h.entries()) {
			if (n === 'Iva' || n === 'Ieps') {
				add.el('th', '#datosHead', '', [['data-col', k[i]]]);
				add.el('span', `th[data-col=${k[i]}]`, n);
				add.el('br', `th[data-col=${k[i]}]`);
				add.el('i', `th[data-col=${k[i]}]`, '', [['class', 'svg-container-datos'], ['title', 'Doble click para agregar o quitar los impuestos']]);
			} else {
				add.el('th', '#datosHead', n, [['data-col', k[i]]]);
			}
		}
		add.icons('.svg-container-datos');
		for (let [i, n] of db.state.entries()) {
			if (n.provedor === main.prov) {	
				add.el('tr', '#datosTbody', '', [['id', 'datosTr' + i], ['class', 'datosTr'], ['data-registro', n.registro]]);
				for (let j of k) {
					switch(j) {
						case 'producto':
						case 'subtotal':
						case 'publico':
						case 'piezas':
						case 'claveProv':
						case 'barras':
						case 'claveFuentes':
						case 'biblia':
							add.el('td', '#datosTr' + i, n[j], [['class', 'datosTd contenteditable'], ['id', 'datosTd' + x], ['contenteditable', 'true'], ['data-col', j]]);
							break;
						case 'iva':
						case 'ieps':
							add.el('td', '#datosTr' + i, n[j], [['class', 'datosTd taxes'], ['id', 'datosTd' + x], ['data-col', j]]);
							break;
						default:
							add.el('td', '#datosTr' + i, n[j], [['class', 'datosTd noteditable'], ['id', 'datosTd' + x], ['data-col', j]]);
							break;
					}
					x++;
				}
			}
		}		
	},
	// updates table & db
	'update': (td) => {
		let row = td.parentElement;
		add.inputValidation(td);
		update.db(row.dataset.registro, td.dataset.col, td.innerText);
		update.row(td, row);
	},
	// toggles taxes on/off
	'changeTax': (td) => {
		let tx = td.dataset.col,
			row = td.parentElement;
		update.db(row.dataset.registro, td.dataset.col, td.innerText);
		update.row(td, row);
	},
	// Menu for user input on filtering options
	'filterMenu': (evt) => {
		let id = 'datosFilterMenu',
			q = '#datosFilterGrid1',
			q2 = '#datosFilterFlex1',
			q3 ='#datosFilterGrid2',
			q4 = '#datosFilterFlex2';
		add.menu(id, [['Filtrar por columnas', 'datosFilterGrid1', 'datosFilterFlex1'], ['Filtrar por filas', 'datosFilterGrid2', 'datosFilterFlex2']]);
		for (let [i, n] of keys.datosHeaders.entries()) {
			add.el('input', q, '', [['type', 'checkbox'], ['checked', 'true'], ['id', 'datosColOption' + i]]);
			add.el('label', q, n, [['for', 'datosColOption' + i], ['datos', keys.datosKeys[i]]]);
		}
		// evt. delg. TODO
		add.el('button', q2, 'Costos', [['class', 'btn1'], ['type', 'button']], [['click', update.boxes]]);
		add.el('button', q2, 'Precios', [['class', 'btn1'], ['type', 'button']], [['click', update.boxes]]);
		add.el('button', q2, 'Aumentos', [['class', 'btn1'], ['type', 'button']], [['click', update.boxes]]);
		add.el('button', q2, 'Biblia', [['class', 'btn1'], ['type', 'button']], [['click', update.boxes]]);
		add.el('input', q3, '', [['type', 'date'], ['id', 'dateFilter']]);
		add.el('label', q3, ' - Última Rev. Costos', [['for', 'dateFilter']]);
		add.el('input', q3, '', [['type', 'text'], ['id', 'codeFilter'], ['placeholder', 'Escribe las claves del provedor separadas por un espacio']]);
		add.el('label', q3, ' - Clave de Provedor', [['for', 'codeFilter']]);
		add.el('button', q4, 'Cancelar', [['class', 'lastBtn']], [['click', () => {add.cancel('.menu');}]]);
		add.el('button', q4, 'Aceptar', [['class', 'lastBtn']], [['click', datos.filter]]);
	},
	// Filter table by col, row or key
	'filter': () => {
		datos.table(keys.datosHeaders, keys.datosKeys);
		let boxes = document.querySelectorAll('.menu input[type="checkbox"]'), // input columns
			others = [], 
			date = document.querySelector('.menu input[type=date]'),
			value = date.value, // input date
			re = /\d+/,
			codes = document.querySelector('.menu input[type=text]').value.split(' '), // clave prov.
			tr = document.querySelectorAll('.table tbody tr'),
			menu = document.querySelector('.menu'); 
		// FILTER ROWS BY CODE
		if (codes[0]) {
			codes.forEach(n => { // loop codes
				for (let i of tr) { // loop rows
					for (let j of i.cells) { // loop td
						// id td matches code[n]
						if (j.dataset.col === 'claveProv' && j.innerText === n) {
							// capture row id
							others.push(i.id); 
						}
					}
				}
			});
			for (let i of tr) { // loop rows
				let del = true;
				others.forEach(n => { // loop row ids
					// if row id match captured id
					if (i.attributes.id.value === n) {
						del = false; // don't delete
					}
				});
				// otherwise delete row
				if (del) {
					i.remove();
				}
			}
			// Re-order the html collection to match input order
			let order = [];
			others.forEach(n => order.push(document.querySelector(`#${n}`)));
			order.forEach(n => document.querySelector('.table tbody').append(n));
			others = []; // reset others 
		}
		// FILTER ROW BY DATE
		if (value !== '') {
			let	year = value.match(re)[0];
			value = value.slice(year.length + 1);
			let month = value.match(re)[0];
			value = value.slice(month.length + 1);
			value = `${value}/${month}/${year}`; // input date in correct format
			for (let i of tr) { // loop rows
				for (let j of i.cells) { // loop td
					// if row don't have correct date
					if (j.dataset.col === 'revCostos' && j.innerText !== value) {
						i.remove(); // remove row
					}
				}
			}
		}
		// FILTER COLUMN
		for (let i of boxes) { // loop boxes
			if (i.checked === false && i.labels) {
				others.push(i.labels[0].attributes.datos.value); // capture col to delete
			}
		}
		for (let i of others) { // loop columns to del
			let x = document.querySelectorAll(`table [data-col=${i}]`);
			for (let j of x) j.remove(); // loop & del every td that matches captured col
		}
		menu.remove(); // close menu after finish
	},
	// Menu for user input on creating a new registry
	'newMenu': (evt) => {
		let id = 'datosNewMenu',
			q = '#datosNewGrid1',
			q2 = '#datosNewFlex1',
			min,
			max,
			x = []; 
		for (let i of db.state) {
			if (i.provedor === main.prov) x.push(i.registro)
		}
		min = Number(x[0]);
		max = Number(x[x.length-1]) + 1;
		add.menu(id, [['Agregar un registro:', 'datosNewGrid1', 'datosNewFlex1']]);
		add.el('input', q, '', [['type', 'number'], ['id', 'datosNewReg'], ['value', max], ['min', min], ['max', max], ['required', 'true']]);
		add.el('label', q, '- No.', [['for', 'datosNewReg']]);
		add.el('input', q, '', [['id', 'datosNewName'], ['required', 'true']]);
		add.el('label', q, '- Nombre', [['for', 'datosNewName']]);
		add.el('input', q, '', [['type', 'number'], ['min', '0.5'], ['step', 'any'], ['id', 'datosNewSubtotal'], ['required', 'true']]);
		add.el('label', q, '- Subtotal', [['for', 'datosNewSubtotal']]);
		add.el('div', q, '', [['id', 'datosNewBlock']]);
		add.el('input', '#datosNewBlock', '', [['type', 'checkbox'], ['id', 'datosNewIva']]);
		add.el('label', '#datosNewBlock', 'IVA', [['for', 'datosNewIva']]);
		add.el('input', '#datosNewBlock', '', [['type', 'checkbox'], ['id', 'datosNewIeps']]);
		add.el('label', '#datosNewBlock', 'IEPS', [['for', 'datosNewIeps']]);
		add.el('div', q);
		add.el('input', q, '', [['type', 'number'], ['min', '0.5'], ['step', 'any'], ['id', 'datosNewPrecio'], ['required', 'true']]);
		add.el('label', q, '- Precio', [['for', 'datosNewPrecio']]);
		add.el('input', q, '', [['type', 'number'], ['id', 'datosNewPiezas'], ['required', 'true']]);
		add.el('label', q, '- Piezas', [['for', 'datosNewPiezas']]);
		add.el('input', q, '', [['id', 'datosNewProv']]);
		add.el('label', q, '- Código Prov.', [['for', 'datosNewProv']]);
		add.el('input', q, '', [['type', 'number'], ['id', 'datosNewBarra']]);
		add.el('label', q, '- Código Barras', [['for', 'datosNewBarra']]);
		add.el('input', q, '', [['id', 'datosNewFuentes']]);
		add.el('label', q, '- Código Fuentes', [['for', 'datosNewFuentes']]);
		add.el('button', q2, 'Cancelar', [['class', 'lastBtn']], [['click', () => add.cancel('.menu')]]);
		add.el('button', q2, 'Aceptar', [['type', 'submit'], ['class', 'lastBtn']], [['click', () => {
			let inv = document.querySelectorAll('input:invalid');
			(inv.length >= 1) ? alert('Favor de completar los campos requeridos') : datos.new();
		}]]);
		let newReg = document.querySelector('#datosNewReg');
		newReg.focus();
	},
	// Creates a new registry in the db
	'new': () => {
		let el = document.querySelector('.menu .grid1').children,
			userInput = [],
			sub,
			reg;
		// get user input to generate the new Reg
		for (let i of el) {
			if (i.id === 'datosNewReg') reg = i.value;
			if (i.id === 'datosNewSubtotal') sub = Number(i.value.replace('$', ''));
			if (i.id === 'datosNewBlock') {
				for (let j of i.children) {
					if (j.localName === 'input') {
						if (j.labels[0].innerText === 'IVA') {
							j.checked 
								? userInput.push(Number((calc.mult([sub, IVA])).replace('$', '')))
								: userInput.push(0)
						} else if (j.labels[0].innerText === 'IEPS') {
							j.checked
								? userInput.push(Number((calc.mult([sub, IEPS])).replace('$', '')))
								: userInput.push(0)
						}
					}
				}
			} else if (i.localName === 'input') {
				if (i.id === 'datosNewSubtotal' || i.id === 'datosNewPrecio' || i.id === 'datosNewPiezas') {
					if (isNaN(i.value)) {
						userInput.push(Number(i.value.replace('$', '')));
					} else {
						userInput.push(Number(i.value));
					}
				} else {
					userInput.push(i.value);
				}
			}
		}
		// make a spot for my new object in the db
		for (let i of db.state) {
			if (i.registro === reg) {
				i.registro = `${Number(i.registro) + 1}`;
				reg = `${Number(reg) + 1}`;
			}
		}
		// make the new registry and sort it in
		const newRegistry = new Reg(userInput);
		db.state.push(newRegistry);
		db.sort();
		// update display
		datos.table(keys.datosHeaders, keys.datosKeys);
		add.cancel('.menu');
	},
	// Menu for user input on remove options
	'removeMenu': (evt) => {
		let id = 'datosRemoveMenu',
			q = '#datosRemoveGrid1',
			q2 = '#datosRemoveFlex2';
		add.menu(id, [['Eliminar un registro:', 'datosRemoveGrid1', 'datosRemoveFlex1'], ['', 'datosRemoveGrid2', 'datosRemoveFlex2']]);
		add.el('input', q, '', [['type', 'number']]);
		add.el('label', q, 'Registro a eliminar'); 
		add.el('button', q, 'Buscar', [['type', 'button']], [['click', datos.removeSearch]]);
		add.el('button', q2, 'Eliminar', [['disabled', 'true'], ['id', 'removeBtn']], [['click', datos.remove]]);
		add.el('button', q2, 'Cancelar', null, [['click', () => add.cancel('.menu')]]);
	},
	// Updates Menu with obj information 
	'removeSearch': (evt) => {
		let reg = document.querySelector('.menu input').value,
			btn = document.querySelector('#removeBtn'),
			q = '#datosRemoveGrid2',
			q2 = '#datosRemoveFlex2',
			b = true;
		document.querySelector(q).innerText = '';
		for (let i of db.state) {
			if (i.registro === reg) {
				add.el('span', q, `No. de Registro: ${i.registro}`, [['id', 'removeFound']]);
				add.el('span', q, `Provedor: ${i.provedor}`);
				add.el('span', q, `Producto: ${i.producto}`);
				add.el('span', q, `Costo: ${i.unitario}`);
				add.el('span', q, `Precio: ${i.publico}`);
				add.el('span', q, `Margen: ${i.margen}`);
				add.el('span', q, `Utilidad: ${i.utilidadUnitaria}`);
				add.el('span', q, `Revisión-Costo: ${i.revCostos}`);
				add.el('span', q, `Revisión-Precio: ${i.revPrecios}`);
				add.el('span', q, `Código-Barras: ${i.barras}`);
				add.el('span', q, `Código-Provedor: ${i.claveProv}`);
				add.el('span', q, `Código-Fuentes: ${i.claveFuentes}`);
				btn.removeAttribute('disabled');
				b = true;
				return
			} else {
				b = false;
			}
		}
		if (!b) btn.setAttribute('disabled', 'true');
	},
	// Removes the obj from the db and updates(re-shoots) the table
	'remove': () => {
		let reg = document.querySelector('#removeFound').innerText.replace('No. de Registro: ', ''),
			x = `${Number(reg)+1}`;
		// deletes the reg obj from my db
		for (let [i,n] of db.state.entries()){
			if (n.registro === reg) {
				db.state.splice(i,1);
			}
		}
		// sorts the remaining registry numbers of my db
		for ( let i of db.state) {
			if (i.registro === x) {
				i.registro = `${Number(i.registro) - 1}`;
				x = `${Number(x) + 1}`;
			}
		}
		// update display
		datos.table(keys.datosHeaders, keys.datosKeys);
		add.cancel('.menu');
	},
	// Prints datos table
	'print': () => {
		let tbl = document.querySelector('#datosTable'),
			print_win = window.open("");
		print_win.document.write(tbl.outerHTML);
		print_win.stop();
		print_win.print();
		print_win.close();
	},
};

const main = {
	'state': '',
	'prov': '',
	'disp': (evt) => {
		let table = document.querySelector('.table'),
			mainBtnRow = document.querySelector('.mainBtnRow');
		main.prov = evt.target.value;
		if (table) table.remove();
		if (mainBtnRow) mainBtnRow.remove();
		switch(main.state) {
			case 'navPedido':
				pedido.table(keys.pedidoHeaders);
				break;
			case 'navRecibir':
				// TO DO
				break;
			case 'navDatos':
				datos.table(keys.datosHeaders, keys.datosKeys);
				break;
			case 'navHist':
				hist.table();
				break;
			case 'navCobrar':
				cobrar.table();
				break;
			case 'navComparar':
				compare.search();
				break;
			default:
				break;
		}
	},
}

const db = {
	'hist': {},
	'state': {},
	'origin': '',
	'id': '',
	'err': () => {
		let x = document.querySelector('.estado'),
			y = document.querySelector('#introNext'),
			z = document.querySelector('#introIconLocal');
		alert('¡Advertencia! El archivo seleccionado no es correcto');
		x.innerText = 'Pendientes';
		y.setAttribute('disabled', 'true');
		z.setAttribute('style', 'background-color:red;');
	},
	'load': (id) => {
		db.id = id;
		let file = document.getElementById(id).files[0];
		if (file) {
			let reader = new FileReader();
			reader.readAsText(file, 'UTF-8');
			reader.onload = db.validator;
		} else {
			alert('Por favor seleccione la base de datos que desea copiar en el servidor');
		}
	},
	'validator': (evt) => {
		let data = evt.target.result;
		// Is it a JSON??
		try {
			data = JSON.parse(data);
		} 
		// if not then throw err
		catch(err) {
			db.err();
			return
		}
		// is it MY JSON??? if not throw err (very simple/limited validation)
		if (!data[0].registro || !data[50].provedor) {
			db.err();
			return
		}
		// it looks like my JSON so continue
		db.id === 'dbFile' ? db.continue(data) : save.post(data);
	},
	'continue': (data) => {
		db.hist = data; // a history object created on the begining to compare on update
		db.state = data;
		db.origin = 'LOCAL';
		let x = document.querySelector('.estado'),
			y = document.querySelector('#introNext'),
			z = document.querySelector('#introIconLocal');
		x.innerText = 'Cargados';
		y.removeAttribute('disabled');
		z.setAttribute('style', 'background-color:green;');
	},
	'sort': () => {
		db.state.sort((a, b) => {
			return Number(a.registro) - Number(b.registro);
		});
	},
};

const intro = {
	'disp': () => {
		let q1 = '.prompt',
			q2 = '.p2',
			q3 = '.intro-grid',
			conn = db.origin === 'SERVER' ? 'Exitosa' : 'Fallida',
			colorServer = db.origin === 'SERVER' ? 'green' : 'red',
			colorLocal = db.origin === 'SERVER' ? 'gray' : 'red',
			state = db.origin === 'SERVER' ? 'Cargados' : 'Pendientes';
		add.el('div', 'body', '', [['class', 'prompt']]);
		add.el('h1', q1, 'Base de Datos: ');
		add.el('div', q1, '', [['class', 'intro-grid']]);
		add.el('i', q3, '', [['class', 'intro-icon'], ['style', `background-color:${colorServer}`]]);
		add.el('span', q3, 'Conexión con el servidor: ');
		add.el('span', q3, conn);
		add.el('i', q3, '', [['class', 'intro-icon'], ['style', `background-color:${colorLocal}`], ['id', 'introIconLocal']]);
		add.el('span', q3, 'Base de datos Local: ', [['id', 'introLocalLabel']]);
		add.el('input', q3, '', [['type', 'file'], ['id', 'dbFile']], [['change', () => db.load('dbFile')]]);
		add.el('div', q1, 'Datos: ', [['class', 'p2']]);
		add.el('span', q2, state, [['class', 'estado']]);
		add.el('button', q2, 'Continuar', [['id', 'introNext']], [['click', () => document.querySelector('.prompt').remove()]]);
		add.el('div', q1, '', [['class', 'intro-flex']]);
		add.el('div', '.intro-flex', '', [['id', 'intro-flex-1']]);
		add.el('button', '#intro-flex-1', 'Guardar datos en el servidor', [['id', 'introSavePost']], [['click', save.promptPost]]);
		add.el('i', '#intro-flex-1', '', [['class', 'svg-container-intro'], ['title', 'Selecciona un archivo local con el cual sobreescribir los datos almacenados en el servidor']]);
		add.el('div', '.intro-flex', '', [['id', 'intro-flex-2']]);
		add.el('button', '#intro-flex-2', 'Guardar datos en el disco', [['id', 'introSaveFile']], [['click', save.file]]);
		add.el('i', '#intro-flex-2', '', [['class', 'svg-container-intro'], ['title', 'Guarda una copia en el disco local de los datos almacenados en el servidor']]);
		add.icons('.svg-container-intro');
		let introBtn = document.querySelector('#introNext'),
			introLabel = document.querySelector('#introLocalLabel'),
			introInput = document.querySelector('#dbFile'),
			introSavePost = document.querySelector('#introSavePost'),
			introSaveFile = document.querySelector('#introSaveFile');
		db.origin === 'SERVER' 
		? (
			add.attr(introLabel, [['class', 'strikedText']]), 
			add.attr(introInput, [['disabled', 'true']])
			) 
		: (
			add.attr(introBtn, [['disabled', 'true']]),
			add.attr(introSavePost, [['disabled', 'true']]),
			add.attr(introSaveFile, [['disabled', 'true']])
			);
	},
};

const connect = {
	'server': () => {
		let xhr = new XMLHttpRequest();
		add.listener(xhr, [['load', connect.ready], ['error', connect.error]])
		xhr.open('GET', 'http://192.168.1.131:80');
		xhr.setRequestHeader('Ayudante', 'True');
		xhr.send();
	},
	'ready': (evt) => {
		if (evt.target.response === '') {
			alert(`Error:${evt.target.statusText}\nFavor de intentarlo de nuevo.`);
			standBy.display();
			return;
		}
		add.cancel('.standBy');
		let dataLoad = evt.target.response,
			dataParsed = JSON.parse(dataLoad);
		db.hist = dataParsed; // a history object created on the begining to compare on update
		db.state = dataParsed;
		db.origin = 'SERVER';
		intro.disp();
	},
	'error': () => {
		add.cancel('.standBy');
		intro.disp();
	},
};

const standBy = {
	'display': () => {
		window.scrollTo(0,0);
		let x = document.querySelector('.standBy'),
			y = document.querySelector('.serverInput');
		if (x) add.cancel('.standBy');
		if (y) add.cancel('.serverInput');
		add.el('div', 'body', null, [['class', 'standBy']]);
		add.el('span', '.standBy', 'Conectando ');
		add.el('i', '.standBy', null, [['class', 'spinner']]);
		connect.server();
	},
};

// ** THE DOCUMENT LISTENERS **

add.listener(document, 
	[
		['DOMContentLoaded', standBy.display],
		['click', (evt) => {
			// NAV MENU
			let link = evt.target.closest('.navLink');
			if (link) {
				main.state = link.id;
				document.querySelector('#main').innerHTML = '';
				if (link.id === 'navCobrar' || link.id === 'navComparar') {
					main.disp(evt)
				}
				else {
					add.el('select', '#main', '', [['class', 'mainSelect']], [['change', main.disp]]);
					add.el('option', '.mainSelect', '--Provedor--', [['selected', 'true']]);
					for (let i of keys.uniqueProv()) {
						add.el('option', '.mainSelect', i, [['value', i]]);
					}
				}
			}
			// ALL >>>> add selection to td
			let td = evt.target.closest('td[contenteditable]');
			if (td) {
				let sel = document.querySelector('.selected');
				if (sel) sel.classList.remove('selected');
				td.classList.add('selected');
				sel = document.querySelector('.selected');
				sel.focus();
				let selection = window.getSelection(),
					range = document.createRange();
				range.selectNodeContents(sel);
				selection.removeAllRanges();
				selection.addRange(range);
			}
			// DATOS  
			if (main.state === 'navDatos') {
				// >>>> sort th
				let th = evt.target.closest('th');
				if (th) {
					add.sort(th);
				}
				// >>>> update row on btn click
				let btn = evt.target.closest('button.mainBtn'),
					td = document.querySelector('.selected');
				if (btn && td) {
					datos.update(td);
				}
			}
			// PEDIDO >>>> update row on btn click
			if (main.state === 'navPedido') {
				let btn = evt.target.closest('button.mainBtn'),
					td = document.querySelector('.selected');
				if (btn && td) {
					pedido.update(td);
				}
			}
		}],
		['input', (evt) => {
			// DATOS >>>> update datos table && db 
			if (main.state === 'navDatos') {
				let td = evt.target.closest('td');
				if (!td) return;
				if (globalTimeout) clearTimeout(globalTimeout);
				globalTimeout = setTimeout(() => {
					datos.update(td);
				}, 8000);
			}
			// PEDIDO >>>> update pedido table && db
			if (main.state === 'navPedido') {
				let td = evt.target.closest('td');
				if (!td) return;
				if (globalTimeout) clearTimeout(globalTimeout);
				globalTimeout = setTimeout(() => {
					pedido.update(td);
				}, 8000);
			}
		}],
		['dblclick', (evt) => {
			// DATOS 
			if (main.state === 'navDatos') {
				let td = evt.target.closest('td');
				if (!td) return
				let col = td.dataset.col; 
				// toggle taxes with dblClick
				if (col === 'iva' || col === 'ieps') datos.changeTax(td);
				// updates subtotal or publico date with dblClick
				if (col === 'subtotal' || col === 'publico') {
					update.db(td.parentElement.dataset.registro, col, td.innerText);
					update.row(td, td.parentElement);
				}
			}
		}], 
		['keydown', evt => {
			let td = document.querySelector('td[contenteditable]'), 
				mnu = document.querySelector('.menu');
			// navigate through contenteditable cells >> Pedido & Datos
			if (td) {
				let sel = document.querySelector('.selected') === null ? td : document.querySelector('.selected'),
					x = true,
					y = sel;
				if (evt.key === 'ArrowLeft' && evt.ctrlKey) {
					evt.preventDefault();
					while (x) {
						x = y.previousElementSibling == null ? false : true
						y = y.previousElementSibling;
						if (y && y.contentEditable === 'true') {
							sel.classList.remove('selected');
							sel = y;
							sel.classList.add('selected');
							sel.focus();
							let selection = window.getSelection(),
								range = document.createRange();
							range.selectNodeContents(sel);
							selection.removeAllRanges();
							selection.addRange(range);
							x = false;
						}
					}
				}
				if (evt.key === 'ArrowRight' && evt.ctrlKey) {
					evt.preventDefault();
					while (x) {
						x = y.nextElementSibling == null ? false : true
						y = y.nextElementSibling;
						if (y && y.contentEditable === 'true') {
							sel.classList.remove('selected');
							sel = y;
							sel.classList.add('selected');
							sel.focus();
							let selection = window.getSelection(),
								range = document.createRange();
							range.selectNodeContents(sel);
							selection.removeAllRanges();
							selection.addRange(range);
							x = false;
						}
					}
				}
				if (evt.key === 'ArrowDown' && evt.ctrlKey) {
					evt.preventDefault();
					if (y.parentElement.nextElementSibling) {
						y = (Array.from(y.parentElement.nextElementSibling.cells)).filter(n => n.dataset.col === sel.dataset.col);
						sel.classList.remove('selected');
						sel = y[0];
						sel.classList.add('selected');
						sel.focus();
						let selection = window.getSelection(),
							range = document.createRange();
						range.selectNodeContents(sel);
						selection.removeAllRanges();
						selection.addRange(range);
					}
				}
				if (evt.key === 'ArrowUp' && evt.ctrlKey) {
					evt.preventDefault();
					if (y.parentElement.previousElementSibling) {
						y = (Array.from(y.parentElement.previousElementSibling.cells)).filter(n => n.dataset.col === sel.dataset.col);
						sel.classList.remove('selected');
						sel = y[0];
						sel.classList.add('selected');
						sel.focus();
						let selection = window.getSelection(),
							range = document.createRange();
						range.selectNodeContents(sel);
						selection.removeAllRanges();
						selection.addRange(range);
					}
				}
				if (evt.key === 'Enter' && !evt.ctrlKey) {
					evt.preventDefault();
					if (y.parentElement.nextElementSibling) {
						y = (Array.from(y.parentElement.nextElementSibling.cells)).filter(n => n.dataset.col === sel.dataset.col);
						sel.classList.remove('selected');
						sel = y[0];
						sel.classList.add('selected');
						sel.focus();
						let selection = window.getSelection(),
							range = document.createRange();
						range.selectNodeContents(sel);
						selection.removeAllRanges();
						selection.addRange(range);
					}
				}
				if (main.state === 'navDatos' && evt.key === 'Enter' && evt.ctrlKey) {
					// update subtotal || publico date with ctrl + enter
					if (sel.dataset.col === 'subtotal' || sel.dataset.col === 'publico') {
						update.db(sel.parentElement.dataset.registro, sel.dataset.col, sel.innerText, true);
						update.row(sel, sel.parentElement);
					}
				}
			}
			// closes menus with esc 
			if (mnu) {
				if (evt.key === 'Escape') {
					add.cancel('.menu');
				}
			}
		}],
		['focusout', evt => {
			if (main.state === 'navDatos') {
				let td = evt.target.closest('td');
				if (!td) return;
				datos.update(td);
			}
			if (main.state === 'navPedido') {
				let td = evt.target.closest('td');
				if (!td) return;
				pedido.update(td);
			}
		}],
	]
);

/*

					*************************
					PENDING

-- BIG ISSUE = only one person can work at a time! since all db saves to the server, not only changes. Also there is no "merge" logic (keep highest val || or print a timestamp to each reg)in place >> MAYBE = keep state of changes (client) and write to db only where necesary (server)

-- (in touch devices) > REMOVE || MAKE RESPONSIVE the question-icon			

-- DATOS > filtrar x filas > clave provedor = insertar un question icon(title: separar las claves con un espacio)
-- DATOS > filtrar x filas > clave provedor = cambiar placeholder(clave(s) de prov.) 
-- DATOS > filtrar x filas > clave provedor = notificar cuando una clave no existe prompt create? or disregard?
-- DATOS > filtrar x filas > MAYBE = agregar filtro por num de reg.
-- DATOS > filtrar x filas > MAYBE = agregar filtro por nombre-de-producto. =~ (buscador)

-- PROBABLY -- "NEW DB" BUTTON = at intro > build a new empty database
-- PROBABLY -- "PROVEDORES" SECTION = to manage prov info (days, $, add new prov, delet prov, change reg's)

-- TO DO -- save pedido in localstorage api every 5 min | every change in value and clear it every 'save' btn click

-- MAYBE -- COMPARATOR = construir un comparador de costos (mi tienda, soriana, heb, walmart) (SERVER)
-- MAYBE -- ACTIONS RECTANGLE = shows possible key actions depending on the main.state

-- PENDING -- COBRAR = dev

					*************************

*/

/* 

			************************************
			I'm on it

DEV: COMPARATOR
PENDING: improve web crawling technique to a page that don't allow web crawling


*/