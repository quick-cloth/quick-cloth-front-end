import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderIdComponent } from './order-id.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OrderService } from '@services/core/order.service';
import { InternalTypesService } from '@services/internal/internal-types.service';
import { MessageService } from 'primeng/api';

describe('OrderIdComponent', () => {
  let component: OrderIdComponent;
  let fixture: ComponentFixture<OrderIdComponent>;
  let mockOrderService: any;
  let mockInternalTypesService: any;
  let mockMessageService: any;

  beforeEach(async () => {
    mockOrderService = jasmine.createSpyObj(['getWardrobeOrderByUUID']);
    mockInternalTypesService = jasmine.createSpyObj(['translateOrderStatus']);
    mockMessageService = jasmine.createSpyObj(['add']);

    await TestBed.configureTestingModule({
      imports: [OrderIdComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'test-uuid' } } } },
        { provide: OrderService, useValue: mockOrderService },
        { provide: InternalTypesService, useValue: mockInternalTypesService },
        { provide: MessageService, useValue: mockMessageService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});