// .src/app/todo.service.ts

import { Injectable } from '@angular/core';
import { environment } from './environments/environment';

/**
 * Define todo type
 */
export interface Todo {
  id?: number;
  todo?: string;
  completed: boolean;
  userId?: number;
}

/**
 * Define todos type
 */
export type Todos = Todo[];

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  api = environment.todo.api;

  /**
   * function to add a todo
   * @param todo - todo to add
   * @returns added todo
   */
  async addTodo(todo: Todo): Promise<Todo> {
    const res = await fetch(`${this.api}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    return await res.json();
  }

  /**
   * function to list todos
   * @returns list of todos
   */
  async listTodos(): Promise<Todos> {
    const res = await fetch(`${this.api}/user/1`);
    const { todos } = await res.json();

    return todos;
  }

  /**
   * function to update a todo
   * @param todo - todo to update
   * @returns updated todo
   */
  async updateTodo(todo: Todo): Promise<Todo> {
    const res = await fetch(`${this.api}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    return await res.json();
  }

  /**
   * function to delete a todo
   * @param id - id of todo to delete
   * @returns deleted todo
   */
  async deleteTodo(id: number): Promise<Todo> {
    const res = await fetch(`${this.api}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  constructor() {}
}
