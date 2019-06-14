import { generateFileNames } from './helpers';

describe('generateFileNames', () => {
  it('should work as expected', () => {
    expect(generateFileNames('ttt.mp4', ['mp4'], ['360p'])).toEqual([
      'ttt.360p.mp4',
    ]);

    expect(generateFileNames('ttt$ggg& 1.mp4', ['mp4'], ['360p'])).toEqual([
      'ttt_ggg__1.360p.mp4',
    ]);

    expect(
      generateFileNames('ttt$ggg& 1.mp4', ['mp4', 'webp'], ['360p']),
    ).toEqual(['ttt_ggg__1.360p.mp4', 'ttt_ggg__1.360p.webp']);
  });
});
