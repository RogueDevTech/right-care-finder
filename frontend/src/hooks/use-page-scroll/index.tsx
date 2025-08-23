import { useCallback, useEffect, useState } from 'react';

export const usePageScroll = () => {
  // This hook only applies to components that make use of the PageWrapper component
  const [page, setPage] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const pageWrapper = document.getElementById('page__wrapper_');
    setPage(pageWrapper);
  }, []);

  const scrollToTop = useCallback(() => {
    if (page) {
      page.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

  const scrollToBottom = useCallback(() => {
    if (page) {
      page.scrollTo({ top: page.scrollHeight, behavior: 'smooth' });
    }
  }, [page]);

  const scrollToElement = useCallback(
    (element: HTMLElement, offset = 0) => {
      if (page) {
        page.scrollTo({
          top: element.offsetTop + offset,
          behavior: 'smooth',
        });
      }
    },
    [page],
  );

  const scrollTo = useCallback(
    (options: ScrollToOptions) => {
      if (page) {
        page.scrollTo(options);
      }
    },
    [page],
  );

  return { scrollToTop, scrollToBottom, scrollToElement, scrollTo };
};
