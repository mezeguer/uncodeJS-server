const indentString = require('indent-string');

class OptionsMap {
  constructor(dictionary) {
    this.dictionary = dictionary;
    this.tab = '  ';
    this.map = new Map();
    this.map.set('Literal', (object) => object.value);

    this.map.set('Identifier', (object) => object.name);

    //Missing a better string explaining function of this keyword
    this.map.set('ThisExpression', (object) => this.dictionary.this);

    this.map.set('ExpressionStatement', (object) =>
      this.map.get(object.expression.type)(object.expression));

    this.map.set('VariableDeclaration', (object) => {
      const declarations = object.declarations;
      const joinedText = declarations.map(dec => this.map.get(dec.type)(dec)).join(` ${this.dictionary.and} `);
      const variableText = declarations.length > 1
                          ? ` ${this.dictionary.variables}: ${declarations.map(dec => dec.id.name).join(', ')};`
                          : ` ${this.dictionary.variable}`;
      return `${object.declarations.length>1?object.declarations.length:"a"} (${object.kind})${variableText} ${joinedText}`
    })
    this.map.set('VariableDeclarator', (object) => {
      if (object.init) {
        return `${this.map.get(object.id.type)(object.id)} ${this.dictionary.variable_declarator_1} ${this.map.get(object.init.type)(object.init)}`;
      }
      return `${this.map.get(object.id.type)(object.id)} ${this.dictionary.variable_declarator_2}`;
    });

    this.map.set('IfStatement', (object, statement = 'if') => {
      let alternate = undefined;
      if (object.alternate) {
        alternate = object.alternate.type === 'IfStatement'
            ? this.map.get(object.alternate.type)(object.alternate, '\n' + this.dictionary.if_statement_1)
            : `\n${this.dictionary.if_statement_2}:\n${object.alternate.type =='BlockStatement'? '' : this.tab}${this.map.get(object.alternate.type)(object.alternate)}`;
      }
      return `${statement} ${this.map.get(object.test.type)(object.test)} ${this.dictionary.if_statement_3}:${object.consequent.type =='BlockStatement'? '' : this.tab}${this.map.get(object.consequent.type)(object.consequent)}\n ${(object.alternate) ? alternate : ''}`;
    })

    this.map.set('ForStatement', (object) => {
      let init = this.map.get(object.init.type)(object.init);
      let condition = this.map.get(object.test.type)(object.test);
      let update = this.map.get(object.update.type)(object.update);
      let doThing = this.map.get(object.body.type)(object.body);
      return indentString(`${init}; ${this.dictionary.for_statement_1} ${condition} ${this.dictionary.for_statement_2},\n${doThing}${update}`, 1, this.tab);
      }
    )

    this.map.set('ForInStatement', (object) => {
      return `${this.dictionary.for_in_statement_1} ${this.map.get(object.right.type)(object.right)}, ${this.dictionary.executes}:${this.map.get(object.body.type)(object.body)}`;
      }
    )

    this.map.set('ForOfStatement', (object) => {
      return `${this.dictionary.for_in_statement_1} ${this.map.get(object.right.type)(object.right)}, ${this.dictionary.executes}:
        ${this.map.get(object.body.type)(object.body)}`;
      }
    )

    this.map.set('WhileStatement', (object) => {
      return `${this.dictionary.while_statement_1} ${this.map.get(object.test.type)(object.test)} ${this.dictionary.while_statement_2}, ${this.map.get(object.body.type)(object.body)} `;
    })

    this.map.set('DoWhileStatement', (object) => {
      return `${this.dictionary.while_statement_1} ${this.map.get(object.test.type)(object.test)} evaluates to true, executes\n${this.map.get(object.body.type)(object.body)}`;
    });
    this.map.set('NewExpression', (object) => {
      return `${this.dictionary.new_expression} ${this.map.get(object.callee.type)(object.callee)}`;
    });
    this.map.set('ConditionalExpression', (object) =>
      `${this.dictionary.conditional_expression_1} ${this.map.get(object.test.type)(object.test)}${this.dictionary.conditional_expression_2} ${this.map.get(object.consequent.type)(object.consequent)}\n${this.tab}${this.dictionary.conditional_expression_3} ${this.map.get(object.alternate.type)(object.alternate)}`);

    this.map.set('LogicalExpression', (object) =>
      object.operator === '&&'
      ? `${this.dictionary.logical_expression_1} ${this.map.get(object.left.type)(object.left)} ${this.dictionary.logical_expression_2} ${this.map.get(object.right.type)(object.right)}`
      : `${this.dictionary.logical_expression_1} ${this.map.get(object.left.type)(object.left)} ${this.dictionary.logical_expression_3} ${this.map.get(object.right.type)(object.right)}`);

    this.map.set('FunctionExpression', (object) =>
      `${this.dictionary.function_expression_1}${object.params.length ? ` ${this.dictionary.function_expression_2} ${object.params.map(param => this.map.get(param.type)(param)).join(', ')} ${this.dictionary.function_expression_3}` : ''}, ${this.dictionary.function_expression_4}:${this.tab}${this.map.get(object.body.type)(object.body)}`);

    this.map.set('CallExpression', (object) =>  {
      return `${this.dictionary.call_expression_1} ${this.map.get(object.callee.type)(object.callee)} ${this.dictionary.call_expression_2} (${object.arguments.map(arg => this.map.get(arg.type)(arg)).join(', ')}) ${this.dictionary.call_expression_3}`;
    });

    this.map.set('FunctionDeclaration', (object) =>
      `${this.dictionary.function_declaration_1} ${this.map.get(object.id.type)(object.id)} ${this.dictionary.function_declaration_2} (${object.params.map(param => this.map.get(param.type)(param)).join(', ')}) ${this.dictionary.function_declaration_3}:\n${this.map.get(object.body.type)(object.body)}`);

    this.map.set('BlockStatement', (object) =>
      `${indentString(object.body.map(line => '\n' + this.map.get(line.type)(line)).join('')+'\n',1,{indent : this.tab})}`);

    this.map.set('BreakStatement', (object) => `${this.dictionary.break_statement_1}`);

    this.map.set('ContinueStatement', (object) => `${continue_statement}`);

    this.map.set('ArrowFunctionExpression', (object) => {
      const paramStatement =  object.params.length===0? this.dictionary.arrow_function_expression_4: object.params.map(param => this.map.get(param.type)(param)).join(', ')+ ' ' + this.dictionary.arrow_function_expression_2;
      if (!object.body.body) {
        return `${this.dictionary.arrow_function_expression_1} ${paramStatement}:\n${this.tab}${this.map.get(object.body.type)(object.body)}`
      }
      return `${this.dictionary.arrow_function_expression_1} ${paramStatement}:\n${this.map.get(object.body.type)(object.body)}`
    });

    this.map.set('ReturnStatement', (object) => `${this.dictionary.return_statement} ${this.map.get(object.argument.type)(object.argument)}`);

    this.map.set('ArrayExpression', (object) => {
      const foo = object.elements.length > 0
          ? `${this.dictionary.array_expression_1} ${object.elements.map(el => this.map.get(el.type)(el)).join(` ${this.dictionary.and} `)}`
          :'';
      return `${this.dictionary.array_expression_2} ${object.elements.length} ${this.dictionary.array_expression_3} ` +  foo;
      }
    );

    this.map.set('ObjectExpression', (object) => {
        `${this.dictionary.object_expression_1} ${object.properties.map(el =>
        `${this.map.get(el.key.type)(el.key)}:${this.map.get(el.value.type)(el.value)}`).join(', ')
      }`});

    this.map.set('ClassDeclaration', (object) =>
      `${this.dictionary.class_declaration_1} ${this.map.get(object.id.type)(object.id)} ${this.map.get(object.body.type)(object.body)}`);

    this.map.set('ClassBody', (object) =>
      `${this.dictionary.class_body_1} ${object.body.length} ${this.dictionary.class_body_2}: \n  ${object.body.map(method => this.map.get(method.type)(method)).join(`${this.tab}${this.dictionary.and} `)}`);

    this.map.set('MethodDefinition', (object) => {
      if (object.kind === 'constructor') {
        return `${this.dictionary.method_definition_1} ${this.map.get(object.value.type)(object.value)}`
      }
      return `${this.dictionary.method_definition_2} ${this.map.get(object.key.type)(object.key)} ${this.dictionary.method_definition_3} ${this.map.get(object.value.type)(object.value)}`
    });

    this.map.set('MemberExpression', (object) =>
            `${this.dictionary.member_expression_1} ${this.map.get(object.property.type)(object.property)} ${this.dictionary.of} ${this.map.get(object.object.type)(object.object)}`);

    this.map.set('UpdateExpression', (object) =>
      object.operator === '++'
        ? `${this.map.get(object.argument.type)(object.argument)} ${this.dictionary.update_expression_1}`
        : `${this.map.get(object.argument.type)(object.argument)} ${this.dictionary.update_expression_2}`
    );

    this.map.set('SwitchStatement', (object) => {
      return `${this.dictionary.switch_statement} (${this.map.get(object.discriminant.type)(object.discriminant)}) and compares the result to the below statements:
        ${object.cases.map(eachCase => this.map.get(eachCase.type)(eachCase)).join('\n')}
      `
    })

    this.map.set('SwitchCase', (object) => {
      if (object.test ===null) {
        return `\t${switch_case_1}:
            ${object.consequent.map(cons => this.map.get(cons.type)(cons)).join('\n')}`;
      }
      else return `${switch_case_2} ${this.map.get(object.test.type)(object.test)} then execute:
            ${object.consequent.map(hi => this.map.get(hi.type)(hi)).join('\n')}`;
    })

    this.map.set('EmptyStatement', (object) => {
      return "";
    })

    this.map.set('UnaryExpression', (object) => {
      const argument = object.argument;
      const nextTextValue = this.map.get(argument.type);
      switch(object.operator) {
        case '!':
          return `${this.dictionary.unary_expresion_1} ${nextTextValue(argument)}`;
        case '-':
          return `${this.dictionary.unary_expresion_2} ${nextTextValue(argument)}`;
        case '+':
          return nextTextValue(argument);
        case '~':
          return `${this.dictionary.unary_expresion_3} ${nextTextValue(argument)}`;
        case 'typeof':
          return `${this.dictionary.unary_expresion_4} ${nextTextValue(argument)} ${this.dictionary.unary_expresion_5}`;
        case 'delete':
          return `${this.dictionary.unary_expresion_6} ${nextTextValue(argument)}`;
        case 'void':
          return `${this.dictionary.unary_expresion_7}`;
      }
    });

    this.map.set('BinaryExpression', (object) => {
      let operatorText;
      switch(object.operator) {
        case '+':
          return `${this.map.get(object.left.type)(object.left)} ${this.dictionary.binary_expression_1} ${this.map.get(object.right.type)(object.right)}`
        case '-':
          return `${this.map.get(object.left.type)(object.left)} ${this.dictionary.binary_expression_2} ${this.map.get(object.right.type)(object.right)}`
        case '*':
          return `${this.map.get(object.left.type)(object.left)} ${this.dictionary.binary_expression_3} ${this.map.get(object.right.type)(object.right)}`
        case '**':
          return `${this.map.get(object.left.type)(object.left)} ${this.dictionary.binary_expression_4} ${this.map.get(object.right.type)(object.right)}`
        case '/':
          return `${this.map.get(object.left.type)(object.left)} ${this.dictionary.binary_expression_5} ${this.map.get(object.right.type)(object.right)}`
        case '&':
          return `${this.dictionary.binary_expression_6_1} ${this.map.get(object.left.type)(object.left)} ${this.dictionary.and} ${this.map.get(object.right.type)(object.right)}`;
        case '|':
          return `${this.dictionary.binary_expression_6_2} ${this.map.get(object.left.type)(object.left)} ${this.dictionary.and} ${this.map.get(object.right.type)(object.right)}`;
        case '^':
          return `${this.dictionary.binary_expression_6_3} ${this.map.get(object.left.type)(object.left)} ${this.dictionary.and} ${this.map.get(object.right.type)(object.right)}`;
        case '<<':
          return `${this.dictionary.binary_representation_of} ${this.map.get(object.left.type)(object.left)} ${this.dictionary.shifted} ${this.map.get(object.right.type)(object.right)} bits to the left`;
        case '>>':
          return `${this.dictionary.binary_representation_of} ${this.map.get(object.left.type)(object.left)} ${this.dictionary.shifted} ${this.map.get(object.right.type)(object.right)} bits to the right`;
        case '>>>':
          return `${this.dictionary.binary_representation_of} ${this.map.get(object.left.type)(object.left)} ${this.dictionary.binary_expression_7} ${this.map.get(object.right.type)(object.right)}`;
        case '<':
          return `${this.dictionary.boolean_value_of} (${this.map.get(object.left.type)(object.left)} ${this.dictionary.is_less_than} ${this.map.get(object.right.type)(object.right)})`;
        case '<=':
          return `${this.dictionary.boolean_value_of} (${this.map.get(object.left.type)(object.left)} ${this.dictionary.is_less_than_or_eql} ${this.map.get(object.right.type)(object.right)})`;
        case '>':
          return `${this.dictionary.boolean_value_of} (${this.map.get(object.left.type)(object.left)} ${this.dictionary.is_greater_than} ${this.map.get(object.right.type)(object.right)})`;
        case '>=':
          return `${this.dictionary.boolean_value_of} (${this.map.get(object.left.type)(object.left)} ${this.dictionary.is_greater_than_or_eql} ${this.map.get(object.right.type)(object.right)})`;
        case '!=':
          return `${this.dictionary.boolean_value_of} (${this.map.get(object.left.type)(object.left)} ${this.dictionary.not_equal} ${this.map.get(object.right.type)(object.right)})`;
        case '!==':
          return `${this.dictionary.boolean_value_of} (${this.map.get(object.left.type)(object.left)} ${this.dictionary.not_deeply_equal} ${this.map.get(object.right.type)(object.right)})`;
        case '==':
          return `${this.dictionary.boolean_value_of} (${this.map.get(object.left.type)(object.left)} ${this.dictionary.is_equal} ${this.map.get(object.right.type)(object.right)})`;
        case '===':
          return `${this.dictionary.boolean_value_of} (${this.map.get(object.left.type)(object.left)} ${this.dictionary.is_deeply_equal} ${this.map.get(object.right.type)(object.right)})`;
        case 'instanceof':
          return `${this.dictionary.boolean_value_of} ${this.dictionary.if} (${this.map.get(object.left.type)(object.left)} ${this.dictionary.constructor} ${this.map.get(object.right.type)(object.right)})`;
        case '%':
          return `${this.dictionary.remainder} ${this.map.get(object.left.type)(object.left)} ${this.dictionary.divided} ${this.map.get(object.right.type)(object.right)}`;
      }
    });

    this.map.set('AssignmentExpression', (object) => {
      let operatorText;
      switch(object.operator) {
        case '=':
          operatorText = '';
          break;
        case '+=':
          operatorText = `${this.dictionary.assignment_expression_1} `;
          break;
        case '-=':
          operatorText = `${this.dictionary.assignment_expression_2} `;
          break;
        case '*=':
          operatorText = `${this.dictionary.assignment_expression_3} `;
          break;
        case '**=':
          operatorText = `${this.dictionary.assignment_expression_4} `;
          break;
        case '/=':
          operatorText = `${this.dictionary.assignment_expression_5} `;
          break;
        case '%=':
          operatorText = `${this.dictionary.assignment_expression_6} `;
          break;
        case '<<=':
          operatorText = `${this.dictionary.assignment_expression_7} `;
          break;
        case '>>=':
          operatorText = `${this.dictionary.assignment_expression_8} `;
          break;
        case '>>>=':
          operatorText = `${this.dictionary.assignment_expression_9} `;
          break;
        case '&=':
          operatorText = `${this.dictionary.assignment_expression_10} `;
          break;
        case '^=':
          operatorText = `${this.dictionary.assignment_expression_11} `;
          break;
        case '|=':
          operatorText = `${this.dictionary.assignment_expression_12} `;
          break;
      }
      return `${this.map.get(object.left.type)(object.left)} ${this.dictionary.final} ${operatorText}${this.map.get(object.right.type)(object.right)}`
    });
  }
}

module.exports = OptionsMap;
