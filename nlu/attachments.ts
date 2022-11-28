export const extractAttachments = async (text: string) => {
  if(!text) return {};
  const linkData = extractLinks(text);
  const buttons = extractButtons(text);
  return {
    links: linkData,
    buttons,
  };
};

export const extractLinks = (text: string) => {
  // find all <a> tags and their hrefs
  const links = text.match(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g);
  const linkData = links?.map((link) => {
    const href = link.match(/href="(.*?)"/)?.[1];
    const text = link.match(/>(.*?)</)?.[1];
    const domain = href?.match(/https?:\/\/(.*?)\//)?.[1];
    return { href, text, domain };
  });
  return linkData;
};

export const extractButtons = (text: string) => {
  // match << __button.<button_type> >> in text
  const buttons = text.match(/<<\s*__button\.(.*?)\s*>>/g);
  const buttonData = buttons?.map((button) => {
    // might have more data in __metadata{key: value} format
    const metadata = button.match(/__metadata\{(.*?)\}/)?.[1];
    const parsed = metadata?.split(",").reduce((acc, curr) => {
      const [key, value] = curr.split(":");
      return { ...acc, [key]: value };
    }, {});
    // type should only be the text immediately after __button. and before __metadata
    const type = button.match(/__button\.(.*?) __metadata/)?.[1];
    return { type, metadata: parsed };
  });

  return buttonData;
};

export const filterAttachments = (text: string) => {
  // anything inside a << >> should be removed
  return text.replace(/<<.*?>>/g, "").trim();
};
