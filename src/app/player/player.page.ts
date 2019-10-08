import {Component} from '@angular/core';

@Component({
    selector: 'app-player',
    templateUrl: 'player.page.html',
    styleUrls: ['player.page.scss']
})
export class PlayerPage {
    private content = '<h1>Introduction</h1>' +
        '<p>' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis commodo ipsum vitae maximus. ' +
        'Ut scelerisque accumsan ipsum, eu pellentesque velit convallis vitae. Duis lorem ante, ultricies quis ' +
        'libero a, imperdiet lacinia turpis. Nunc nec fringilla ex. Curabitur vel venenatis velit. Aenean ex risus, ' +
        'vehicula a aliquam quis, tincidunt quis dui. Aenean non urna lacinia, vulputate lacus nec, vestibulum felis. ' +
        'Nunc eros neque, condimentum rhoncus ultrices ac, rhoncus non metus. Nullam ac nisl pharetra, pretium sem porta, ' +
        'posuere dui. Ut convallis hendrerit ante et gravida. In pellentesque ex ut nisi congue, in ultricies metus venenatis. ' +
        'Morbi nisi nulla, posuere vitae tincidunt vel, viverra ut ipsum.' +
        '</p>' +
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAACWCAYAAABNcIgQAAAB4UlEQVR42u3VMQEAAAjDMFCO9OEAAyQS+rSTmgKAp' +
        '9oIATBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCAD' +
        'BCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCAIzQCAEwQgAwQgAwQgAwQgAwQgAwQgAwQgA' +
        'wQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAw' +
        'QgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgCMUAYAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAj' +
        'BAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAALgsUt3' +
        'XksTHmUQAAAABJRU5ErkJggg==">' +
        '<p>' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis commodo ipsum vitae maximus. ' +
        'Ut scelerisque accumsan ipsum, eu pellentesque velit convallis vitae. Duis lorem ante, ultricies quis ' +
        'libero a, imperdiet lacinia turpis. Nunc nec fringilla ex. Curabitur vel venenatis velit. Aenean ex risus, ' +
        'vehicula a aliquam quis, tincidunt quis dui. Aenean non urna lacinia, vulputate lacus nec, vestibulum felis. ' +
        'Nunc eros neque, condimentum rhoncus ultrices ac, rhoncus non metus. Nullam ac nisl pharetra, pretium sem porta, ' +
        'posuere dui. Ut convallis hendrerit ante et gravida. In pellentesque ex ut nisi congue, in ultricies metus venenatis. ' +
        'Morbi nisi nulla, posuere vitae tincidunt vel, viverra ut ipsum.' +
        '</p>' +
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAACWCAYAAABNcIgQAAAB5UlEQVR42u3VwQAAQAgAwQviTPKLJdMMEmgGYT8bP' +
        '7seABwVRgiAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQ' +
        'KAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQJghEYIgBECgBECgBECgBECgBECgBE' +
        'CgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBEC' +
        'gBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECYIQyAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEA' +
        'GCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAL' +
        'AZKp7UHTrTYwkAAAAASUVORK5CYII=">' +
        '<p>' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis commodo ipsum vitae maximus. ' +
        'Ut scelerisque accumsan ipsum, eu pellentesque velit convallis vitae. Duis lorem ante, ultricies quis ' +
        'libero a, imperdiet lacinia turpis. Nunc nec fringilla ex. Curabitur vel venenatis velit. Aenean ex risus, ' +
        'vehicula a aliquam quis, tincidunt quis dui. Aenean non urna lacinia, vulputate lacus nec, vestibulum felis. ' +
        'Nunc eros neque, condimentum rhoncus ultrices ac, rhoncus non metus. Nullam ac nisl pharetra, pretium sem porta, ' +
        'posuere dui. Ut convallis hendrerit ante et gravida. In pellentesque ex ut nisi congue, in ultricies metus venenatis. ' +
        'Morbi nisi nulla, posuere vitae tincidunt vel, viverra ut ipsum.' +
        '</p>' +
        '<h1>Chapter 1</h1>' +
        '<p>' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis commodo ipsum vitae maximus. ' +
        'Ut scelerisque accumsan ipsum, eu pellentesque velit convallis vitae. Duis lorem ante, ultricies quis ' +
        'libero a, imperdiet lacinia turpis. Nunc nec fringilla ex. Curabitur vel venenatis velit. Aenean ex risus, ' +
        'vehicula a aliquam quis, tincidunt quis dui. Aenean non urna lacinia, vulputate lacus nec, vestibulum felis. ' +
        'Nunc eros neque, condimentum rhoncus ultrices ac, rhoncus non metus. Nullam ac nisl pharetra, pretium sem porta, ' +
        'posuere dui. Ut convallis hendrerit ante et gravida. In pellentesque ex ut nisi congue, in ultricies metus venenatis. ' +
        'Morbi nisi nulla, posuere vitae tincidunt vel, viverra ut ipsum.' +
        '</p>' +
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAACWCAYAAABNcIgQAAAB4UlEQVR42u3VMQEAAAjDMFCO9OEAAyQS+rSTmgKAp' +
        '9oIATBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCAD' +
        'BCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCADBCAIzQCAEwQgAwQgAwQgAwQgAwQgAwQgAwQgA' +
        'wQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAw' +
        'QgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgAwQgCMUAYAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAj' +
        'BAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAAjBAALgsUt3' +
        'XksTHmUQAAAABJRU5ErkJggg==">' +
        '<p>' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis commodo ipsum vitae maximus. ' +
        'Ut scelerisque accumsan ipsum, eu pellentesque velit convallis vitae. Duis lorem ante, ultricies quis ' +
        'libero a, imperdiet lacinia turpis. Nunc nec fringilla ex. Curabitur vel venenatis velit. Aenean ex risus, ' +
        'vehicula a aliquam quis, tincidunt quis dui. Aenean non urna lacinia, vulputate lacus nec, vestibulum felis. ' +
        'Nunc eros neque, condimentum rhoncus ultrices ac, rhoncus non metus. Nullam ac nisl pharetra, pretium sem porta, ' +
        'posuere dui. Ut convallis hendrerit ante et gravida. In pellentesque ex ut nisi congue, in ultricies metus venenatis. ' +
        'Morbi nisi nulla, posuere vitae tincidunt vel, viverra ut ipsum.' +
        '</p>' +
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAACWCAYAAABNcIgQAAAB5UlEQVR42u3VwQAAQAgAwQviTPKLJdMMEmgGYT8bP' +
        '7seABwVRgiAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQ' +
        'KAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQKAEQJghEYIgBECgBECgBECgBECgBECgBE' +
        'CgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBEC' +
        'gBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECgBECYIQyAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEA' +
        'GCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAGCEAL' +
        'AZKp7UHTrTYwkAAAAASUVORK5CYII=">' +
        '<p>' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis commodo ipsum vitae maximus. ' +
        'Ut scelerisque accumsan ipsum, eu pellentesque velit convallis vitae. Duis lorem ante, ultricies quis ' +
        'libero a, imperdiet lacinia turpis. Nunc nec fringilla ex. Curabitur vel venenatis velit. Aenean ex risus, ' +
        'vehicula a aliquam quis, tincidunt quis dui. Aenean non urna lacinia, vulputate lacus nec, vestibulum felis. ' +
        'Nunc eros neque, condimentum rhoncus ultrices ac, rhoncus non metus. Nullam ac nisl pharetra, pretium sem porta, ' +
        'posuere dui. Ut convallis hendrerit ante et gravida. In pellentesque ex ut nisi congue, in ultricies metus venenatis. ' +
        'Morbi nisi nulla, posuere vitae tincidunt vel, viverra ut ipsum.' +
        '</p>';

    log(value) {
        console.log(value);
    }
}
