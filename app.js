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
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
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
			type === 'exp'
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
				type: document.querySelector(elements.inputType).value, // Either 'inc' or 'exp'
				desc: document.querySelector(elements.inputDesc).value,
				value: document.querySelector(elements.inputValue).value
			};
		},
		getElements: () => {
			return elements;
		}
	};
})();

// Serves as the controller of the application
const controller = ((budgetCtrl, UICtrl) => {
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

	const ctrlAddItem = () => {
		// 1. Get field input value
		const input = UICtrl.getInput();
		// 2. Add item to the budget controller
		const newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
		// 3. Add the item to the UI
		// 4. Recalculate the budget
		// 5. Display the budget in the UI
	};

	return {
		init: () => {
			console.log('Start');
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();
