import jsPDF from 'jspdf';
import mermaid from 'mermaid';

// Define types locally to avoid circular dependencies or missing types
interface Feature {
    name: string;
    description: string;
    complexity: string;
}

interface BuildStep {
    step: number;
    title: string;
    description: string;
    tasks: string[];
}

interface ApiEndpoint {
    method: string;
    endpoint: string;
    description: string;
}

interface Resource {
    title: string;
    url: string;
}

interface Step3Data {
    featureList: Feature[];
    buildBreakdown: BuildStep[];
    apiEndpoints: ApiEndpoint[];
    resources: {
        youtube: Resource[];
        docs: Resource[];
    };
    diagrams: {
        highLevel: string;
        requestFlow: string;
        deployment: string;
        apiGateway: string;
        databaseErd: string;
    };
}

export const generatePDF = async (projectIdea: string, stack: string, detail: Step3Data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let cursorY = 20;

    // Helper to add text and advance cursor
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false, color: string = '#000000') => {
        doc.setFontSize(fontSize);
        doc.setTextColor(color);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');

        const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin);

        // Check for page break
        if (cursorY + splitText.length * fontSize * 0.5 > pageHeight - margin) {
            doc.addPage();
            cursorY = margin;
        }

        doc.text(splitText, margin, cursorY);
        cursorY += splitText.length * fontSize * 0.4 + 4; // Line height + spacing
    };

    // Helper to add a section header
    const addHeader = (text: string) => {
        cursorY += 5;
        addText(text, 16, true, '#333333');
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, cursorY - 2, pageWidth - margin, cursorY - 2);
        cursorY += 5;
    };

    // Helper to render Mermaid diagram to Image
    const addDiagram = async (title: string, code: string) => {
        if (!code) return;

        addHeader(title);

        try {
            // Sanitize code
            code = code.replace(/-->\|(.+?)\|> /g, '-->|$1| ')
                .replace(/\]([A-Z])/g, ']\n$1');
            if (!code.includes('\n')) {
                code = code.replace(/^(graph \w+|sequenceDiagram|classDiagram|stateDiagram-v2|erDiagram)/, '$1\n');
            }

            // Render SVG
            const id = `mermaid-pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const { svg } = await mermaid.render(id, code);

            // Create a temporary container to draw the SVG
            const container = document.createElement('div');
            container.innerHTML = svg;
            const svgElement = container.querySelector('svg');

            if (svgElement) {
                // Get dimensions
                const viewBox = svgElement.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 800, 600];
                const width = viewBox[2];
                const height = viewBox[3];

                // Convert to Canvas
                const canvas = document.createElement('canvas');
                canvas.width = width * 2; // High res
                canvas.height = height * 2;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    const img = new Image();
                    // Use Base64 Data URL to avoid "tainted canvas" issues
                    const svg64 = btoa(unescape(encodeURIComponent(svg)));
                    const url = `data:image/svg+xml;base64,${svg64}`;

                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = url;
                    });

                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const imgData = canvas.toDataURL('image/png');

                    // Calculate PDF image dimensions to fit page
                    const maxWidth = pageWidth - 2 * margin;
                    const imgHeight = (maxWidth / width) * height;

                    // Check page break
                    if (cursorY + imgHeight > pageHeight - margin) {
                        doc.addPage();
                        cursorY = margin;
                    }

                    doc.addImage(imgData, 'PNG', margin, cursorY, maxWidth, imgHeight);
                    cursorY += imgHeight + 10;
                }
            }
        } catch (e) {
            console.error("PDF Diagram Error", e);
            addText(`[Error rendering diagram: ${title}]`, 10, false, '#ff0000');
        }
    };

    // --- DOCUMENT CONTENT ---

    // Title Page
    addText("Build Specification", 24, true, '#000000');
    addText(`Project: ${projectIdea}`, 14, false, '#555555');
    addText(`Stack: ${stack}`, 14, false, '#555555');
    addText(`Generated on: ${new Date().toLocaleDateString()}`, 10, false, '#888888');
    cursorY += 10;

    // Features
    addHeader("Feature Scope");
    detail.featureList.forEach(f => {
        addText(`• ${f.name} (${f.complexity})`, 12, true);
        addText(`  ${f.description}`, 11, false, '#444444');
        cursorY += 2;
    });

    // Build Plan
    addHeader("Build Breakdown");
    detail.buildBreakdown.forEach(b => {
        addText(`Step ${b.step}: ${b.title}`, 12, true);
        addText(b.description, 11, false, '#444444');
        b.tasks.forEach(t => addText(`  - ${t}`, 10, false, '#666666'));
        cursorY += 5;
    });

    // API
    addHeader("API Endpoints");
    detail.apiEndpoints.forEach(e => {
        addText(`${e.method} ${e.endpoint}`, 11, true, '#000000');
        addText(e.description, 10, false, '#444444');
        cursorY += 3;
    });

    // Resources
    addHeader("Resources");
    addText("Documentation:", 12, true);
    detail.resources.docs.forEach(r => addText(`• ${r.title}: ${r.url}`, 10, false, '#0000EE'));
    cursorY += 3;
    addText("Videos:", 12, true);
    detail.resources.youtube.forEach(r => addText(`• ${r.title}: ${r.url}`, 10, false, '#0000EE'));

    // Diagrams (New Page)
    doc.addPage();
    cursorY = margin;
    addText("System Architecture", 20, true);
    cursorY += 10;

    await addDiagram("High Level Architecture", detail.diagrams.highLevel);
    await addDiagram("Request Flow", detail.diagrams.requestFlow);
    await addDiagram("Deployment", detail.diagrams.deployment);
    await addDiagram("API Gateway", detail.diagrams.apiGateway);
    await addDiagram("Database Schema", detail.diagrams.databaseErd);

    // Save
    doc.save('build-specification.pdf');
};
