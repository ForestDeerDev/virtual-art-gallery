// 图片懒加载指令
import type { Directive, DirectiveBinding } from 'vue'

const lazyLoad: Directive = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding) {
    console.log('Lazy load directive mounted');
    
    // 存储图片URL到dataset中，以便后续可以获取
    el.dataset.src = binding.value;
    
    // 加载图片的函数
    const loadImage = () => {
      const imgUrl = el.dataset.src;
      if (imgUrl && (!el.src || el.src !== imgUrl)) {
        console.log('Loading image:', imgUrl);
        el.src = imgUrl;
        // 图片加载完成后，添加loaded类
        el.onload = () => {
          console.log('Image loaded successfully');
          el.classList.add('loaded');
        };
        el.onerror = () => {
          console.error('Error loading image:', imgUrl);
        };
      }
    };

    // 检查元素是否在视口内的函数
    const isInViewport = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 1.2 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.bottom >= 0 &&
        rect.right >= 0
      );
    };

    // 创建一个IntersectionObserver实例
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Element intersecting, loading image');
            // 当元素进入视口时，加载图片
            loadImage();
            // 停止观察该元素
            observer.unobserve(el);
          }
        });
      },
      {
        // 元素进入视口10%时触发
        threshold: 0.1,
        // 根元素外边距，让图片在进入视口前200px就开始加载
        rootMargin: '200px 0px'
      }
    );

    // 立即检查元素是否在视口内
    if (isInViewport(el)) {
      console.log('Element in viewport, loading image immediately');
      // 如果在视口内，立即加载图片
      loadImage();
    } else {
      console.log('Element not in viewport, observing');
      // 否则，观察目标元素
      observer.observe(el);
      // 保存observer实例，以便在组件卸载时清理
      (el as any)._lazyObserver = observer;
    }

    // 保存加载函数和观察器
    (el as any)._loadImage = loadImage;
    (el as any)._isInViewport = isInViewport;
  },
  updated(el: HTMLImageElement, binding: DirectiveBinding) {
    console.log('Lazy load directive updated');
    
    // 当绑定值变化时，更新dataset并重新检查
    if (binding.value !== binding.oldValue) {
      console.log('Binding value changed:', binding.value);
      el.dataset.src = binding.value;
      
      // 立即检查元素是否在视口内
      if ((el as any)._isInViewport && (el as any)._isInViewport(el)) {
        console.log('Element in viewport after update, loading image');
        // 如果在视口内，立即加载图片
        if ((el as any)._loadImage) {
          (el as any)._loadImage();
        }
      }
    }
  },
  unmounted(el: HTMLImageElement) {
    console.log('Lazy load directive unmounted');
    // 清理observer实例
    if ((el as any)._lazyObserver) {
      (el as any)._lazyObserver.unobserve(el);
    }
  }
};

export default lazyLoad;
