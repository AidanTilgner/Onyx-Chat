export const extractAttachments = async (text: string) => {
  const linkData = await extractLinks(text);
  return {
    links: linkData,
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
