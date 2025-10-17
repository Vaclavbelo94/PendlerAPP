# Mobile Components Usage Guide

## MobileBottomNavigation

Bottom navigation bar for mobile apps.

```typescript
import { MobileBottomNavigation } from '@/components/mobile';

function App() {
  return (
    <MobileBottomNavigation
      items={[
        { to: '/', icon: Home, label: 'Home' },
        { to: '/shifts', icon: Calendar, label: 'Shifts', badge: 3 },
        { to: '/profile', icon: User, label: 'Profile' }
      ]}
    />
  );
}
```

### Props
- `items`: Navigation items with `to`, `icon`, `label`, and optional `badge`
- `className`: Additional CSS classes

## MobileSheet

Mobile-friendly drawer/sheet component.

```typescript
import { MobileSheet } from '@/components/mobile';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      position="bottom"
      title="Options"
    >
      <div>Sheet content</div>
    </MobileSheet>
  );
}
```

### Props
- `isOpen`: Boolean to control visibility
- `onClose`: Callback when sheet closes
- `position`: 'bottom' | 'right' | 'left'
- `title`: Optional title
- `children`: Sheet content

## SwipeableCard

Card with swipe actions (edit, delete).

```typescript
import { SwipeableCard } from '@/components/mobile';

function ItemList() {
  return (
    <SwipeableCard
      onEdit={() => console.log('Edit')}
      onDelete={() => console.log('Delete')}
      editLabel="Edit"
      deleteLabel="Delete"
    >
      <div>Card content</div>
    </SwipeableCard>
  );
}
```

### Props
- `onEdit`: Edit action callback
- `onDelete`: Delete action callback
- `editLabel`: Edit button label
- `deleteLabel`: Delete button label
- `customActions`: Optional array of custom actions
- `children`: Card content

## MobileTabs

Horizontally scrollable tabs with swipe navigation.

```typescript
import { MobileTabs } from '@/components/mobile';

function TabsExample() {
  const [activeTab, setActiveTab] = useState('tab1');
  
  const tabs = [
    { id: 'tab1', label: 'Tab 1', icon: Home },
    { id: 'tab2', label: 'Tab 2', icon: Calendar }
  ];
  
  return (
    <MobileTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      enableSwipe
    >
      {activeTab === 'tab1' ? <Tab1Content /> : <Tab2Content />}
    </MobileTabs>
  );
}
```

### Props
- `tabs`: Array of tab objects with `id`, `label`, optional `icon`
- `activeTab`: Currently active tab ID
- `onTabChange`: Callback when tab changes
- `enableSwipe`: Enable swipe navigation between tabs
- `children`: Tab content

## MobileList

Infinite scrolling list for mobile.

```typescript
import { MobileList } from '@/components/mobile';

function InfiniteList() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = async () => {
    const newItems = await fetchItems();
    setItems([...items, ...newItems]);
    setHasMore(newItems.length > 0);
  };
  
  return (
    <MobileList
      items={items}
      renderItem={(item) => <ItemCard item={item} />}
      onLoadMore={loadMore}
      hasMore={hasMore}
      loading={false}
      emptyMessage="No items found"
    />
  );
}
```

### Props
- `items`: Array of items to render
- `renderItem`: Function to render each item
- `onLoadMore`: Callback to load more items
- `hasMore`: Boolean indicating if more items available
- `loading`: Boolean for loading state
- `emptyMessage`: Message when list is empty

## MobileOptimizedInput

Input with automatic mobile keyboard optimization.

```typescript
import { MobileOptimizedInput } from '@/components/forms';

function FormExample() {
  return (
    <MobileOptimizedInput
      type="email"
      name="email"
      placeholder="Enter email"
    />
  );
}
```

Automatically applies:
- Correct `inputmode` for input type
- Appropriate `autocomplete` attributes
- Mobile-friendly styling

## Hooks

### useDevice

Get device information.

```typescript
import { useDevice } from '@/hooks/useDevice';

function MyComponent() {
  const { isMobile, isTablet, orientation } = useDevice();
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
    </div>
  );
}
```

### useImageOptimization

Optimize image loading for mobile.

```typescript
import { useImageOptimization } from '@/hooks';

function ImageComponent({ src, alt }) {
  const { imageSrc, isLoaded, imageRef } = useImageOptimization({
    src,
    lowQualitySrc: `${src}?quality=10`,
    loading: 'lazy'
  });
  
  return (
    <img
      ref={imageRef}
      src={imageSrc}
      alt={alt}
      className={isLoaded ? 'loaded' : 'loading'}
    />
  );
}
```

### useIntersectionObserver

Observe element visibility.

```typescript
import { useIntersectionObserver } from '@/hooks';

function LazyComponent() {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  
  return (
    <div ref={ref}>
      {isVisible ? <ExpensiveComponent /> : <Placeholder />}
    </div>
  );
}
```

## Styling Utilities

### Touch Optimization

```css
/* Touch target */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Touch active state */
.touch-active:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* Mobile spacing */
.mobile-spacing {
  padding: 1rem;
  gap: 1rem;
}
```

### Safe Areas

```css
/* Safe area padding */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.pt-safe {
  padding-top: env(safe-area-inset-top);
}
```

### Scrolling

```css
/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Mobile scroll container */
.mobile-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
```

## Best Practices

### Touch Targets
- Minimum 44x44px for all interactive elements
- Use `touch-manipulation` for better touch response
- Add adequate spacing between targets (min 8px)

### Performance
- Lazy load images and components
- Use virtual scrolling for long lists
- Implement proper caching strategies
- Monitor memory usage

### Gestures
- Provide visual feedback for swipe actions
- Allow gesture cancellation
- Don't override native browser gestures

### Forms
- Use correct input types for mobile keyboards
- Implement proper autocomplete
- Show validation inline
- Keep forms short and focused

### Navigation
- Use bottom navigation for primary actions
- Implement swipe-to-go-back where appropriate
- Provide clear visual feedback for navigation state

### Offline Support
- Cache critical resources
- Show offline indicators
- Queue actions for sync when online
- Provide meaningful offline experience
