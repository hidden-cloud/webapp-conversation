import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import DOMPurify from 'dompurify';


// 增强型HTML块识别（支持多行嵌套）
const parseHtmlBlocks = (content: string) => {
  const blocks: Array<{ type: 'html' | 'text'; content: string }> = [];
  let remaining = content;
  let lastIndex = 0;

  // 匹配开闭标签对
  const tagPattern = /<details(\s[^>]*)?>([\s\S]*?)<\/details>/gi;

  while (true) {
    const match = tagPattern.exec(remaining);
    if (!match) break;

    // 提取前面的文本内容
    if (match.index > lastIndex) {
      blocks.push({
        type: 'text',
        content: remaining.slice(lastIndex, match.index)
      });
    }

    // 添加完整的HTML块
    blocks.push({
      type: 'html',
      content: match[0]
    });

    lastIndex = tagPattern.lastIndex;
  }

  // 处理剩余文本
  if (lastIndex < remaining.length) {
    blocks.push({
      type: 'text',
      content: remaining.slice(lastIndex)
    });
  }

  return blocks;
};

// 安全渲染组件
const SafeHTML = ({ html }: { html: string }) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['details', 'summary'],
    ALLOWED_ATTR: ['style', 'open']
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

export function Markdown(props: { content: string }) {

  const blocks = parseHtmlBlocks(props.content);

  return (
    <div className="markdown-body">
      {blocks.map((block, index) => {
        if (block.type === 'html') {
          return (
            <div key={`html-${index}`} className="html-block">
              <SafeHTML html={block.content} />
            </div>
          );
        }

        return (
          <ReactMarkdown
            key={`md-${index}`}
            remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
            rehypePlugins={[RehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={atelierHeathLight}
                    language={match[1]}
                    PreTag="div"
                    showLineNumbers
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              }
            }}
            linkTarget={'_blank'}
          >
            {block.content}
          </ReactMarkdown>
        );
      })}
    </div>
  )
}
