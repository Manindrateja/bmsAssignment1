(() => {
	const add = document.querySelector('input');
	const list = document.querySelector('.list');
	const duplicateList = document.querySelector('.duplicates');

	let MainList = new Set(); // list of NUmbers

	let onKeyUp = (e) => {

		switch(e.code) {
			case 'Enter':
				addToList(add.value);
				break;
			case 'Minus':
				break;
			case 'Comma':
			case 'Backspace':
			default:
				displayDuplicates(getDuplicates(add.value));
				break;
		}
	}

	add.addEventListener('keyup', onKeyUp);

	function addToList(value){

		if(!value) return;

		const str = value.replace(/\s+/g, '');
		const items = str.split(',');
		const size = MainList.size;

		const duplicates = getDuplicates(value);

		for( let i of items) {
			if(Number.isInteger(Number(i)) && Number(i) > -1){
				MainList.add(Number(i));
			}
			else {
				if(i.indexOf('-') > 0){
					let [from, to] = i.split('-').map(m => Number(m));
					if(from < to){
						for(var n = from; n <= to; n++)
							MainList.add(n);
					}
					// else{
					// 	console.log('Invalid Item', i)
					// }
				}
				// else{
				// 	console.log('Invalid Item', )
				// }
			}
		}

		displayList();
		add.value = '';
		//getDuplicates('');

		displayAddedSkipped(duplicates,  MainList.size - size);
	}

	// Displays Main List
	function displayList(){
		list.innerHTML = [...MainList].join(', ');
	}

	function displayDuplicates(duplicates) {
		
		let dstr = '';
		if(duplicates.length)
			dstr +=`<div class="item head"><strong class="expression">Expressions</strong><strong class="items">Duplicate values which will skipped</strong></div>`;

		for(let d of duplicates){
			dstr += `<div class="item ${d.valid ? 'valid': 'invalid'}"><div class="expression">${d.i}</div>`
			if(d.valid)
				dstr +=`<div class="items">${(d.numbers.length > 0)? d.numbers.join(', '): ''}</div></div>`
			else
				dstr +=`<div class="items invalid">Invalid Expression</div></div>`
		}
		duplicateList.innerHTML = dstr;
	}

	function displayAddedSkipped(duplicates, size){

		duplicateList.innerHTML = '';
		if(size > 0)
			duplicateList.innerHTML =  `<div class="added">${size} ${(size > 1)?' values are ': ' is ' }added to list</div>`;

		let nums = [], expressions = [];
		for(let d of duplicates){
			debugger;
			if(d.valid)
				nums.push(...d.numbers);
			else
				expressions.push(d.i);
		}
		debugger;
		if(nums.length)
			duplicateList.innerHTML += `<div class="item invalid"><div class="items">${nums.join(', ')} are skipped</div></div>`;
		if(expressions.length)
			duplicateList.innerHTML += `<div class="item invalid"><div class="items">Expressions ${expressions.join(', ')} are Invalid so skipped</div></div>`;

		setTimeout(() => {
			duplicateList.innerHTML = '';
		},5000)
	}

	// Displays Duplicates
	function getDuplicates(value){

		const duplicates = [];
		const str = value.replace(/\s+/g, '');
		const items = str.split(',');
		
		// debugger;
		for( let i of items) {
			if(Number.isInteger(Number(i)) && Number(i) > -1){
				if(MainList.has(Number(i))){
					duplicates.push({i: i, numbers: Number(i), valid: true});
				}
			}
			else {
				if(i.indexOf('-') > 0){
					let [from, to] = i.split('-').map(m => Number(m));

					if(from < to){
						let dup = []; counter = 0;
						for(var n = from; n <= to; n++){
							if(MainList.has(n)){
								dup.push(n);
							}
						}
						if(dup.length)
							duplicates.push( { i: i, numbers: dup, valid: true });
					}
					else{
						// console.log('Invalid Item', i);
						duplicates.push({i: i, valid: false});
					}
				}
				else{
					// console.log('Invalid Item', i)
					duplicates.push({i: i, valid: false});
				}
			}
		}
		
		return duplicates;
	}

})();