import * as fs from 'fs';
export default function (plop) {
	plop.setGenerator("component", {
		description: '🔥 Generates new React component 🔥',
		prompts: [
		  {
			type: 'input',
			name: 'name',
			message: "What's the name of the Component?",
			validate: function (value) {
			  let message = true
			  if (!/.+/.test(value)) {
				message = console.error('Missing', 'you must define a component name')
			  } else if (
				fs.existsSync(`./components/${value}`)
			  ) {
				  message = console.error(
					  ' already exists',
					  `"${value}" is not valid`,
				  )
			  }
			  return message
			},
		  },
		],
		actions: [
			{
			  type: 'add',
			  path: 'components/{{pascalCase name}}/{{pascalCase name}}.js',
			  templateFile: './generator/components/templates/component.hbs',
			},
			{
                path: 'jsconfig.json',
                pattern: /(\/\/ INDIVIDUAL COMPONENTS)/g,
                template: '\t\t\t"@{{name}}Component": ["components/{{name}}/{{name}}.js"],\n$1',
                type: 'modify',
            },
		  ]
	});

	plop.setGenerator("reactivity", {
		description: '🔥 Generates new Apollo Reactivity 🔥',
		prompts: [
		  {
			type: 'input',
			name: 'name',
			message: "What's the name of the reactivity?",
			validate: function (value) {
			  let message = true
			  if (!/.+/.test(value)) {
				message = console.error('Missing', 'you must define a reactivity name')
			  } else if (
				fs.existsSync(`./graphql/reactivities/${value}.js`)
			  ) {
				  message = console.error(
					  ' already exists',
					  `"${value}" is not valid`,
				  )
			  }
			  return message
			},
		  },
		],
		actions: [
			{
			  type: 'add',
			  path: 'graphql/reactivities/{{pascalCase name}}/{{pascalCase name}}Reactivity.js',
			  templateFile: './generator/reactivities/templates/reactivity.hbs',
			},
			{
                path: 'jsconfig.json',
                pattern: /(\/\/ INDIVIDUAL REACTIVITIES)/g,
                template: '\t\t\t"@{{name}}Reactivity": ["graphql/reactivities/{{name}}/{{name}}Reactivity.js"],\n$1',
                type: 'modify',
            },
		  ]
	});
}
