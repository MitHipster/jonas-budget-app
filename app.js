// App modules used to create a separation of concerns (simple MVC)
// Acts as a simplified model
const budgetController = (() => {
	const Expense = function(id, desc, value) {
		this.id = id;
		this.desc = desc;
		this.value = value;
	};
	const Income = function(id, desc, value) {
		this.id = id;
		this.desc = desc;
		this.value = value;
	};

	const data = {
		items: {
			expenses: [],
			income: []
		},
		totals: {
			expenses: 0,
			income: 0
		}
	};

	return {
		addItem: (type, desc, value) => {
			let newItem, id;
			// Generate a random ID
			id = (
				Date.now().toString(36) +
				Math.random()
					.toString(36)
					.substr(2, 5)
			).toUpperCase();
			// Create a new item based on type
			type === 'expenses'
				? (newItem = new Expense(id, desc, value))
				: (newItem = new Income(id, desc, value));

			// Push item into the data structure
			data.items[type].push(newItem);
			return newItem;
		},
		testing: () => {
			console.log(data);
		}
	};
})();

// Handles the applications view
const UIController = (() => {
	const elements = {
		inputType: '.add__type',
		inputDesc: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	};

	return {
		getInput: () => {
			return {
				type: document.querySelector(elements.inputType).value, // Either 'income' or 'expenses'
				desc: document.querySelector(elements.inputDesc).value,
				value: document.querySelector(elements.inputValue).value
			};
		},
		addListItem: (item, type) => {
			// Create HTML string for income / expense item
			let html = `
			<div class="item clearfix" id="${type}-${item.id}">
				<div class="item__description">${item.desc}</div>
				<div class="right clearfix">
					<div class="item__value">${item.value}</div>
					${type === 'expenses' ? '<div class="item__percentage">0%</div>' : ''}
					<div class="item__delete">
						<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
					</div>
				</div>
			</div>
			`;
			// Insert HTML into the DOM
			document
				.querySelector(`.${type}__list`)
				.insertAdjacentHTML('beforeend', html);
		},
		getElements: () => {
			return elements;
		},
		clearInputs: () => {
			// Converted node list into an array to demonstrate using the call method on the Array prototype
			const inputs = document.querySelectorAll(
				elements.inputDesc + ', ' + elements.inputValue
			);
			const inputsArr = Array.prototype.slice.call(inputs);
			inputsArr.forEach(input => {
				input.value = '';
			});
			// Set focus on first input element
			inputsArr[0].focus();
		}
	};
})();

// Serves as the controller of the application
const controller = ((budgetCtrl, UICtrl) => {
	const ctrlAddItem = () => {
		// 1. Get field input value
		const input = UICtrl.getInput();
		// 2. Add item to the budget controller
		const newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
		// 3. Add item to the UI
		UICtrl.addListItem(newItem, input.type);
		// 4. Clear input fields
		UICtrl.clearInputs();
		// 5. Recalculate the budget
		// 6. Display the budget in the UI
	};
	const setupEventListeners = () => {
		const UIElements = UICtrl.getElements();
		document
			.querySelector(UIElements.inputBtn)
			.addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', e => {
			// which is used to support older browsers
			if (e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});
	};

	return {
		init: () => {
			console.log('Start');
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();
