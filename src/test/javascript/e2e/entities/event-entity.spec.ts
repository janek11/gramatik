import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('EventEntity e2e test', () => {

    let navBarPage: NavBarPage;
    let eventEntityDialogPage: EventEntityDialogPage;
    let eventEntityComponentsPage: EventEntityComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load EventEntities', () => {
        navBarPage.goToEntity('event-entity');
        eventEntityComponentsPage = new EventEntityComponentsPage();
        expect(eventEntityComponentsPage.getTitle())
            .toMatch(/gramatikApp.eventEntity.home.title/);

    });

    it('should load create EventEntity dialog', () => {
        eventEntityComponentsPage.clickOnCreateButton();
        eventEntityDialogPage = new EventEntityDialogPage();
        expect(eventEntityDialogPage.getModalTitle())
            .toMatch(/gramatikApp.eventEntity.home.createOrEditLabel/);
        eventEntityDialogPage.close();
    });

    it('should create and save EventEntities', () => {
        eventEntityComponentsPage.clickOnCreateButton();
        eventEntityDialogPage.setNameInput('name');
        expect(eventEntityDialogPage.getNameInput()).toMatch('name');
        eventEntityDialogPage.setCreationDateInput('2000-12-31');
        expect(eventEntityDialogPage.getCreationDateInput()).toMatch('2000-12-31');
        eventEntityDialogPage.userSelectLastOption();
        eventEntityDialogPage.save();
        expect(eventEntityDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class EventEntityComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-event-entity div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class EventEntityDialogPage {
    modalTitle = element(by.css('h4#myEventEntityLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    creationDateInput = element(by.css('input#field_creationDate'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setCreationDateInput = function(creationDate) {
        this.creationDateInput.sendKeys(creationDate);
    };

    getCreationDateInput = function() {
        return this.creationDateInput.getAttribute('value');
    };

    userSelectLastOption = function() {
        this.userSelect.all(by.tagName('option')).last().click();
    };

    userSelectOption = function(option) {
        this.userSelect.sendKeys(option);
    };

    getUserSelect = function() {
        return this.userSelect;
    };

    getUserSelectedOption = function() {
        return this.userSelect.element(by.css('option:checked')).getText();
    };

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
