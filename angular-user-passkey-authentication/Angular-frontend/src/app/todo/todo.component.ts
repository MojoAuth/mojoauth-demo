// ./src/app/todo/todo.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { Todo, Todos, TodoService } from '../todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  todos: Todos = [];
  todo = '';

  constructor(private todoService: TodoService) {}

  // list todos on init
  ngOnInit(): void {
    this.listTodos();
  }

  /**
   * function to update the todo body
   * @param event event
   */
  updateBody(event: any) {
    this.todo = event.target.value;
    console.log({ body: this.todo });
  }

  /**
   * function to update the todo completed state
   */
  updateCompleted(event: any) {
    const { currentTarget } = event;
    this.updateTodo({ id: currentTarget.id, completed: currentTarget.checked });
    console.log({ currentTarget });
  }

  /**
   * function to list todos
   */
  listTodos() {
    this.todoService.listTodos().then((todos) => {
      this.todos = todos;
      console.log({ todos });
    });
  }

  /**
   * function to add a todo
   * @param event event
   */
  addTodo(event: any) {
    console.log({ event });

    event.preventDefault();
    const todo = {
      todo: this.todo,
      completed: false,
      userId: 1,
    };

    this.todoService.addTodo(todo).then((todo) => {
      this.todos.push(todo);
      this.todo = '';

      console.log({ todo });
    });
  }

  /**
   * function to update a todo
   * @param param0 todo to update
   */
  updateTodo({ id, completed }: Todo) {
    this.todoService.updateTodo({ id, completed }).then((todo) => {
      this.todos.push(todo);
      console.log({ todo });
      console.log({ todos: this.todos });
    });
  }

  /**
   * function to delete a todo
   * @param id - id of todo to delete
   */
  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).then((todo) => {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      console.log({ todo });
    });
  }
}
