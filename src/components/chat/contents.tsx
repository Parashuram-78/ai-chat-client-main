"use client";

import { ChevronLeft, DownloadIcon } from "lucide-react";
import { Button } from "../ui/button";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { ScrollArea } from "../ui/scroll-area";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { marked } from "marked";
import html2pdf from "html2pdf.js";
import { cn } from "@/lib/utils";

import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

// 1) Import docx
import { Document, Packer, Paragraph, AlignmentType, ImageRun, TextRun, Footer, Header } from "docx";
import rehypeRaw from "rehype-raw";
import { toast } from "@/hooks/use-toast";

// ... keep your existing type definitions, etc.

type ChatContentsProps = {
	streamResponse: string;
	loading: boolean;
	setStreamResponse: Dispatch<SetStateAction<string>>;
};

const useTypewriter = (text: string, speed: number) => {
	const [displayText, setDisplayText] = useState("");

	useEffect(() => {
		let currentIndex = 0;
		setDisplayText("");

		const typeInterval = setInterval(() => {
			if (currentIndex < text.length) {
				setDisplayText((prev) => prev + text[currentIndex]);
				currentIndex += 1;
			} else {
				clearInterval(typeInterval);
			}
		}, speed);

		return () => clearInterval(typeInterval);
	}, [text, speed]);

	return displayText;
};

export function ChatContents({ loading, streamResponse, setStreamResponse }: ChatContentsProps) {
	const [isEditable, setIsEditable] = useState(false);
	const [editableContent, setEditableContent] = useState(streamResponse);

	useEffect(() => {
		setEditableContent(streamResponse);
	}, [streamResponse]);

	// === Existing PDF logic remains as is ===
	const downloadAsPDF = async () => {
		if (typeof window === "undefined" || typeof document === "undefined") return;

		try {
			const htmlContent = await marked(editableContent);
			const styledContent = `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; padding: 20px;">
    ${htmlContent
					.replace(/<h1>/g, '<h1 style="font-size: 1.5rem; font-weight: bold; margin-top: 1rem; margin-bottom: 1rem; color: #000;">')
					.replace(/<h2>/g, '<h2 style="font-size: 1.25rem; font-weight: bold; margin-top: 1rem; margin-bottom: 1rem; color: #000;">')
					.replace(/<h3>/g, '<h3 style="font-size: 1rem; font-weight: bold; margin-top: 1rem; margin-bottom: 1rem; color: #000;">')
					.replace(/<h4>/g, '<h4 style="font-size: 0.875rem; font-weight: bold; margin-top: 1rem; margin-bottom: 1rem; color: #000;">')
					.replace(/<li>/g, '<li style=" color: #000;">')
					.replace(/<ul>/g, '<ul style=" color: #000; list-style-type: disc;">')
					.replace(/<ol>/g, '<ol style=" color: #000; list-style-type: decimal; ">')
					.replace(/<p>/g, '<p style="font-size: 0.825rem; margin-bottom: 1em; color: #000;">')

					.replace(/<code>/g, '<code style="background-color: rgb(255, 255, 255); color: #000; border-radius: 0.25rem; padding: 0.4rem 0.6rem; margin: 0.25rem;">')

					.replace(/<a>/g, '<a style="color: #1e90ff; text-decoration: none;">')

					.replace(/<strong>/g, '<strong style="font-weight: bold; color: #000 margin-top: 0.8rem; margin-bottom: 0.6rem; font-size: 16px;">')
					.replace(/<b>/g, '<b style="font-weight: bold; margin-top: 0.8rem; color: #000 margin-bottom: 0.6rem; font-size: 16px;">')

					.replace(/<img>/g, '<img style="max-width: 100%; height: auto; color: #000 border-radius: 0.5rem; margin: 1rem 0; display: block;" />')

					.replace(/<table>/g, '<table style="width: 100%; border-collapse: collapse; color: #000; margin: 1rem 0;">')
					.replace(/<th>/g, '<th style="background-color: #f2f2f2; font-weight: bold; padding: 0.8rem; text-align: left; border: 1px solid #ddd; color: #000;">')
					.replace(/<td>/g, '<td style="padding: 0.8rem; border: 1px solid #ddd; color: #000;">')
					.replace(/<tr>/g, '<tr style="border-bottom: 1px solid #ddd;">')}
  </body>
</html>`;


			const element = document.createElement('div');
			element.className = 'markdown-content';
			element.innerHTML = styledContent;

			const opt = {
				margin: 10,
				filename: 'document.pdf',
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: {
					scale: 2,
					useCORS: true,
					letterRendering: true
				},
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
			};

			await html2pdf().from(element).set(opt).save();

		} catch (error) {
			console.error('Error generating PDF:', error);
		}
	};






	// === 2) Replace old .doc logic with new .docx logic ===
       async function downloadAsDocx(): Promise<void> {
        if (typeof window === "undefined" || typeof document === "undefined") return;


        try {
            // 1) First convert markdown to HTML with proper formatting
            const htmlContent = await marked(editableContent, {
                gfm: true, // Enable GitHub Flavored Markdown
                breaks: true
            });


            // 2) Create a temp DOM element to parse the HTML
            const tempContainer = document.createElement("div");
            tempContainer.innerHTML = htmlContent;


            // We'll store docx Paragraphs here
            const docxParagraphs: Paragraph[] = [];


            // 3) Process nodes with better formatting
            const processNode = async (node: Node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;
                    const tagName = element.tagName.toUpperCase();


                    // Handle headings with proper styling
                    if (tagName.match(/^H[1-6]$/)) {
                        const headingText = element.textContent?.trim() ?? "";
                        if (!headingText) return;


                        const level = parseInt(tagName[1]);
                        const fontSize = level === 1 ? 72 : level === 2 ? 56 : 44;


                        docxParagraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: headingText,
                                        size: fontSize,
                                        bold: true,
                                        color: "2E74B5",
                                        font: "Calibri Light"
                                    })
                                ],
                                spacing: {
                                    before: 480 - ((level - 1) * 80),
                                    after: 240 - ((level - 1) * 40)
                                },
                                keepNext: true,
                                keepLines: true,
                                outlineLevel: level
                            })
                        );
                        return;
                    }


                    // Handle lists with better formatting
                    if (tagName === "UL" || tagName === "OL") {
                        const processListItems = (items: HTMLCollection, level: number) => {
                            Array.from(items).forEach((li, index) => {
                                const listText = li.textContent?.trim() ?? "";
                                if (listText) {
                                    const bulletPoint = tagName === "UL" ? "•" : `${index + 1}.`;
                                    const isBold = li.querySelector('strong, b') !== null;


                                    docxParagraphs.push(
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: bulletPoint + " ",
                                                    bold: true,
                                                    size: 28,
                                                    color: "2E74B5"
                                                }),
                                                new TextRun({
                                                    text: listText,
                                                    size: isBold ? 28 : 24,
                                                    bold: isBold
                                                })
                                            ],
                                            spacing: { before: 120, after: 120 },
                                            indent: {
                                                left: 720 + (level * 360),
                                                hanging: 360
                                            }
                                        })
                                    );
                                }


                                const nestedLists = li.getElementsByTagName(tagName);
                                if (nestedLists.length > 0) {
                                    processListItems(nestedLists[0].children, level + 1);
                                }
                            });
                        };
                        processListItems(element.children, 0);
                        return;
                    }


                    // Handle code blocks
                    if (tagName === "PRE" || tagName === "CODE") {
                        const codeText = element.textContent?.trim() ?? "";
                        if (codeText) {
                            docxParagraphs.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: codeText,
                                            font: "Consolas",
                                            size: 20,
                                            color: "666666"
                                        })
                                    ],
                                    spacing: { before: 240, after: 240 },
                                    shading: {
                                        type: "solid",
                                        color: "F8F9FA"
                                    },
                                    border: {
                                        top: { style: "single", size: 1, color: "E1E4E8" },
                                        bottom: { style: "single", size: 1, color: "E1E4E8" },
                                        left: { style: "single", size: 1, color: "E1E4E8" },
                                        right: { style: "single", size: 1, color: "E1E4E8" }
                                    }
                                })
                            );
                        }
                        return;
                    }


                    // Handle blockquotes
                    if (tagName === "BLOCKQUOTE") {
                        const quoteText = element.textContent?.trim() ?? "";
                        if (quoteText) {
                            docxParagraphs.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: quoteText,
                                            italics: true,
                                            size: 24,
                                            color: "4A5568"
                                        })
                                    ],
                                    spacing: { before: 240, after: 240 },
                                    indent: { left: 720 },
                                    border: {
                                        left: { style: "single", size: 24, color: "4A5568" }
                                    },
                                    shading: {
                                        type: "solid",
                                        color: "F8F9FA"
                                    }
                                })
                            );
                        }
                        return;
                    }


					if (node instanceof Text) {
						const text = node.textContent?.trim() ?? "";
						if (text) {
						  const isBold = element.closest('strong, b') !== null;
					  
						  docxParagraphs.push(
							new Paragraph({
							  children: [
								new TextRun({
								  text: text,
								  size: isBold ? 28 : 24,
								  bold: isBold,
								  color: isBold ? "000000" : "333333",
								}),
							  ],
							  spacing: { before: 120, after: 120 },
							})
						  );
					  }
					  return;
					  }
                    // Process child nodes to maintain order
                    for (const childNode of Array.from(element.childNodes)) {
                        await processNode(childNode);
                    }


                    // Handle images
                    if (tagName === "IMG") {
                        const imgElement = element as HTMLImageElement;
                        const srcAttr = imgElement.src;
                        const altText = imgElement.alt || "Image";


                        if (!srcAttr) throw new Error("Image has no src attribute.");


                        try {
                            let imageBuffer: Buffer | Uint8Array;
                            if (srcAttr.startsWith('data:image')) {
                                const base64Data = srcAttr.split(',')[1];
                                imageBuffer = Buffer.from(base64Data, 'base64');
                            } else {
                                const response = await fetch(srcAttr, { mode: "cors" });
                                if (!response.ok) throw new Error(`Failed to fetch image: ${srcAttr}`);
                                const blob = await response.blob();
                                const arrayBuffer = await blob.arrayBuffer();
                                imageBuffer = new Uint8Array(arrayBuffer);
                            }


                            docxParagraphs.push(
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            data: imageBuffer,
                                            transformation: {
                                                width: 500,
                                                height: 300
                                            },
                                            type: "png"
                                        })
                                    ],
                                    alignment: AlignmentType.CENTER,
                                    spacing: { before: 240, after: 120 }
                                })
                            );


                            // Add image caption
                            docxParagraphs.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `Figure: ${altText}`,
                                            italics: true,
                                            size: 20,
                                            color: "666666"
                                        })
                                    ],
                                    alignment: AlignmentType.CENTER,
                                    spacing: { before: 60, after: 240 }
                                })
                            );
                        } catch (error) {
                            console.error("Error processing image:", error);
                            docxParagraphs.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "[Image could not be loaded]",
                                            color: "FF0000",
                                            italics: true
                                        })
                                    ],
                                    alignment: AlignmentType.CENTER,
                                    spacing: { before: 120, after: 120 }
                                })
                            );
                        }
                    }
                } else if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent?.trim() ?? "";
                    if (text) {
                        const parentElement = node.parentElement;
                        const isBold = parentElement?.closest('strong, b') !== null;
                        docxParagraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: text,
                                        size: isBold ? 28 : 24,
                                        bold: isBold,
                                        color: isBold ? "000000" : "333333"
                                    })
                                ],
                                spacing: { before: 120, after: 120 }
                            })
                        );
                    }
                }
            };


            // Process all nodes sequentially to maintain order
            for (const node of Array.from(tempContainer.childNodes)) {
                await processNode(node);
            }


            // 4) Create the doc with professional styling
            const doc = new Document({
                styles: {
                    default: {
                        document: {
                            run: {
                                font: "Calibri",
                                size: 24,
                                color: "333333"
                            },
                            paragraph: {
                                spacing: { line: 360 },
                                alignment: AlignmentType.JUSTIFIED
                            }
                        }
                    },
                    paragraphStyles: [
                        {
                            id: "Heading1",
                            name: "Heading 1",
                            basedOn: "Normal",
                            next: "Normal",
                            quickFormat: true,
                            run: {
                                font: "Calibri Light",
                                size: 56,
                                bold: true,
                                color: "2E74B5"
                            },
                            paragraph: {
                                spacing: { before: 480, after: 240 },
                                keepNext: true,
                                keepLines: true
                            }
                        },
                        {
                            id: "Heading2",
                            name: "Heading 2",
                            basedOn: "Normal",
                            next: "Normal",
                            quickFormat: true,
                            run: {
                                font: "Calibri Light",
                                size: 44,
                                bold: true,
                                color: "2E74B5"
                            },
                            paragraph: {
                                spacing: { before: 400, after: 200 },
                                keepNext: true,
                                keepLines: true
                            }
                        },
                        {
                            id: "Heading3",
                            name: "Heading 3",
                            basedOn: "Normal",
                            next: "Normal",
                            quickFormat: true,
                            run: {
                                font: "Calibri Light",
                                size: 36,
                                bold: true,
                                color: "2E74B5"
                            },
                            paragraph: {
                                spacing: { before: 320, after: 160 },
                                keepNext: true,
                                keepLines: true
                            }
                        }
                    ]
                },
                sections: [
                    {
                        properties: {
                            page: {
                                margin: {
                                    top: 1440,
                                    right: 1080,
                                    bottom: 1440,
                                    left: 1080
                                }
                            }
                        },
                        headers: {
                            default: new Header({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Generated Document",
                                                font: "Calibri",
                                                size: 24,
                                                color: "2E74B5",
                                                bold: true
                                            }),
                                            new TextRun({
                                                text: "  •  ",
                                                font: "Calibri",
                                                size: 24,
                                                color: "666666"
                                            }),
                                            new TextRun({
                                                text: new Date().toLocaleDateString(),
                                                font: "Calibri",
                                                size: 24,
                                                color: "666666"
                                            })
                                        ],
                                        alignment: AlignmentType.RIGHT,
                                        spacing: { after: 240 },
                                        border: {
                                            bottom: { style: "single", size: 6, color: "EEEEEE" }
                                        }
                                    })
                                ]
                            })
                        },
                        footers: {
                            default: new Footer({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Page ",
                                                font: "Calibri",
                                                size: 20,
                                                color: "666666"
                                            }),
                                            new TextRun({
                                                children: ["PAGE"],
                                                font: "Calibri",
                                                size: 20,
                                                color: "666666",
                                                bold: true
                                            }),
                                            new TextRun({
                                                text: " of ",
                                                font: "Calibri",
                                                size: 20,
                                                color: "666666"
                                            }),
                                            new TextRun({
                                                children: ["NUMPAGES"],
                                                font: "Calibri",
                                                size: 20,
                                                color: "666666",
                                                bold: true
                                            })
                                        ],
                                        alignment: AlignmentType.CENTER,
                                        border: {
                                            top: { style: "single", size: 6, color: "EEEEEE" }
                                        },
                                        spacing: { before: 240 }
                                    })
                                ]
                            })
                        },
                        children: docxParagraphs
                    }
                ]
            });


            // 5) Generate and download with a better filename
            const blob = await Packer.toBlob(doc);
            const filename = `document_${new Date().toISOString().split('T')[0]}.docx`;


            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

			toast({ title: "Document downloaded successfully!", variant: "default" });
        } catch (err) {
            console.error("Error generating docx:", err);
			toast({ title: "Error generating docx:", variant: "destructive" });

        }
    }



	// Typewriter effect
	const typewriterText = useTypewriter(streamResponse, 9);

	if (!streamResponse) {
		return <p className="text-center text-gray-400">No response yet.</p>;
	}

	return (
		<section
			className={cn(
				"h-screen bg-background dark:bg-[#2f2f2f]",
				streamResponse ? "" : "hidden md:block"
			)}
		>
			{/* Header */}
			<header className="p-4 lg:p-6 flex items-center justify-between shadow gap-x-6 sticky top-0 z-10 bg-secondary">
				<Button
					variant="outline"
					size="icon"
					className="bg-transparent hover:bg-transparent rounded-full border border-[#575757]"
					onClick={() => {
						if (loading) return;
						setStreamResponse("");
					}}
					aria-label="Reset Response"
				>
					<ChevronLeft />
				</Button>
				<div className="flex gap-4">
					<Link
						href="https://www.markdownguide.org/basic-syntax"
						target="_blank"
					>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="default" className="rounded-full">?</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Markdown Reference</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</Link>
					<Button
						variant="default"
						onClick={() => {
							if (!isEditable) {
								setEditableContent(streamResponse);
							} else {
								setStreamResponse(editableContent);
							}
							setIsEditable(!isEditable);
						}}
					>
						{isEditable ? "Save Changes" : "Edit"}
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div>
								<Button className="hidden sm:flex">
									<DownloadIcon />
									<span>Download</span>
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="rounded-full flex sm:hidden bg-primary text-primary-foreground"
								>
									<DownloadIcon />
								</Button>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-20">
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={downloadAsPDF}>As PDF</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={downloadAsDocx}>As Docx</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>

			{/* Response markdown */}
			<ScrollArea className="p-5 h-[calc(100vh-4.25rem)] lg:h-[calc(100vh-5.25rem)]">
				{isEditable ? (
					<textarea
						value={editableContent || ""}
						onChange={(e) => setEditableContent(e.target.value)}
						className="w-full h-[450px] bg-transparent text-white border border-gray-500 p-3 rounded-lg"
					/>
				) : loading ? (
					<p className="text-center text-gray-400">Loading...</p>
				) : (
					<Markdown
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[rehypeRaw]}
						className="text-Inter markdown-content"
					>
						{typewriterText}
					</Markdown>
				)}
			</ScrollArea>
		</section>
	);
}
