export interface Section {
  id: string
  title: string
  content: string
  subsections?: {
    title: string
    content: string
  }[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface CodeExample {
  id: string
  title: string
  description: string
  language: 'python' | 'cuda' | 'cpp'
  code: string
  output?: string
  explanation: string
}

export interface Visualization {
  id: string
  title: string
  description: string
  type: '3d' | '2d' | 'interactive'
  component: string
}

export interface Module {
  id: string
  number: number
  title: string
  subtitle: string
  description: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  learningObjectives: string[]
  sections: Section[]
  visualizations: Visualization[]
  codeExamples: CodeExample[]
  quizQuestions: QuizQuestion[]
  exercises: string[]
  resources: {
    title: string
    url: string
    type: 'article' | 'video' | 'paper' | 'documentation'
  }[]
}

export const modules: Module[] = [
  {
    id: 'module1',
    number: 1,
    title: 'Introduction to GPU Computing',
    subtitle: 'Understanding the fundamentals of parallel computing and GPU architecture',
    description: 'Foundation concepts: CPU vs GPU, parallel processing, history of GPU evolution, and why GPUs matter for ML/DL.',
    duration: '3-4 hours',
    difficulty: 'beginner',
    prerequisites: ['Basic programming knowledge (Python)', 'Understanding of computer architecture'],
    learningObjectives: [
      'Understand the historical evolution of GPU architecture',
      'Grasp fundamental concepts of parallel computing',
      'Compare and contrast CPU and GPU architectures',
      'Recognize the critical role of GPUs in modern AI',
      'Identify key performance metrics of GPU computing'
    ],
    sections: [
      {
        id: 'evolution',
        title: 'Evolution of GPU Architecture',
        content: `Graphics Processing Units (GPUs) have undergone a remarkable transformation from specialized graphics accelerators to general-purpose parallel computing powerhouses. Understanding this evolution is crucial to appreciating modern GPU capabilities.

## The Graphics Era (1990s-2006)

In the 1990s, GPUs were **fixed-function pipelines** designed exclusively for rendering 3D graphics. Early graphics cards like the 3dfx Voodoo and NVIDIA RIVA series could only perform predetermined graphics operations—vertex transformation, texture mapping, and rasterization.

### Key Milestones

**1999: NVIDIA GeForce 256** - The first processor to be officially called a "GPU." It featured hardware transform and lighting (T&L), offloading these calculations from the CPU.

**2001: Programmable Shaders** - The introduction of programmable vertex and pixel shaders (DirectX 8, OpenGL) allowed developers to customize the graphics pipeline, marking the first step toward general-purpose computing.

**2006: CUDA Revolution** - NVIDIA introduced CUDA (Compute Unified Device Architecture), providing a C-like programming interface for GPUs. This was the watershed moment that transformed GPUs from graphics processors into general-purpose parallel computing engines.

## The GPGPU Era (2006-2012)

General-Purpose computing on Graphics Processing Units (GPGPU) emerged as researchers realized GPUs' massive parallel processing power could accelerate non-graphics tasks.

### Early GPGPU Challenges

Before CUDA, using GPUs for computation required "tricking" graphics APIs:
- Encoding data as textures
- Writing algorithms as pixel shaders
- Reading results as rendered images

This was cumbersome and limited to researchers with graphics programming expertise.

### CUDA's Impact

CUDA democratized GPU computing by providing:
- C/C++ extensions for GPU programming
- Explicit memory management
- Thread hierarchy (threads, blocks, grids)
- Specialized math libraries (cuBLAS, cuFFT)

## Modern GPU Architectures (2012-Present)

**2012: Deep Learning Revolution** - AlexNet's ImageNet victory using CUDA-enabled GPUs proved the value of GPU acceleration for deep learning, sparking the modern AI revolution.

**2017: Tensor Cores** - NVIDIA Volta architecture introduced specialized Tensor Cores for mixed-precision matrix operations, offering up to 8x AI workload acceleration.

**2020: Ampere Architecture** - Third-generation Tensor Cores, sparsity acceleration, and multi-instance GPU (MIG) for better resource utilization.

**2022: Hopper Architecture** - Transformer Engine for FP8 precision, thread block clusters, and asynchronous execution for modern LLMs.

### Architectural Evolution

| Generation | Year | Key Innovation | AI Performance |
|------------|------|----------------|----------------|
| Kepler | 2012 | First ML-optimized GPU | Baseline |
| Maxwell | 2014 | Energy efficiency | 2x |
| Pascal | 2016 | HBM2, NVLink | 3x |
| Volta | 2017 | Tensor Cores | 12x |
| Turing | 2018 | RT Cores, INT8 | 15x |
| Ampere | 2020 | 3rd-gen Tensor Cores | 20x |
| Hopper | 2022 | Transformer Engine | 30x |

## The Future

Modern GPUs continue evolving with:
- **Specialized accelerators** for transformers, sparse operations
- **Multi-die designs** for scaling beyond monolithic limits
- **Optical interconnects** for faster multi-GPU communication
- **Near-memory computing** to reduce data movement bottlenecks

The GPU has transformed from a graphics accelerator to the computational engine driving AI, scientific computing, and data analytics.`,
        subsections: [
          {
            title: 'From Graphics to Computing',
            content: 'The transformation of GPUs from specialized graphics processors to general-purpose compute engines represents one of the most significant shifts in computer architecture history.'
          }
        ]
      },
      {
        id: 'parallelism',
        title: 'Parallelism Fundamentals',
        content: `Understanding parallel computing is essential to grasping GPU architecture. The fundamental principle is simple yet powerful: **divide a large problem into smaller sub-problems that can be solved simultaneously**.

## Types of Parallelism

### 1. Data Parallelism ⭐ GPU Strength

**Definition**: Apply the same operation to different data elements simultaneously.

**Example**: Adding two arrays
\`\`\`
A = [1, 2, 3, 4, 5, 6, 7, 8]
B = [10, 20, 30, 40, 50, 60, 70, 80]
C[i] = A[i] + B[i]  // Each element independent!
\`\`\`

Instead of computing C[0], then C[1], then C[2]... sequentially, we can compute ALL elements simultaneously on different GPU cores.

**ML Example**: Applying ReLU activation to a tensor
\`\`\`python
# Sequential (CPU-style)
for i in range(len(tensor)):
    tensor[i] = max(0, tensor[i])

# Parallel (GPU-style) - conceptually
parallel_for i in range(len(tensor)):
    tensor[i] = max(0, tensor[i])
\`\`\`

### 2. Task Parallelism

**Definition**: Different tasks running simultaneously on different data.

**Example**: In a deep learning pipeline:
- Task 1: Data augmentation
- Task 2: Model inference
- Task 3: Loss computation

These can run in parallel on different processing units.

### 3. Pipeline Parallelism

**Definition**: Different stages of a process execute concurrently on different data.

**Example**: Instruction pipelining in processors or model parallelism in large neural networks where different layers run on different GPUs.

## Flynn's Taxonomy

Computer architectures are classified by how they handle instructions and data:

### SISD - Single Instruction, Single Data
- Traditional sequential computing
- One instruction operates on one data element at a time
- Example: Old single-core CPUs

### SIMD - Single Instruction, Multiple Data ⭐
- **This is the GPU's primary model!**
- One instruction operates on multiple data elements simultaneously
- Example: Adding 1000 numbers to 1000 other numbers with ONE add instruction

\`\`\`
SIMD Addition (conceptual):
Instruction: ADD
Data1: [1, 2, 3, ..., 1000]
Data2: [10, 20, 30, ..., 10000]
Result: [11, 22, 33, ..., 11000]  // All computed simultaneously!
\`\`\`

### MISD - Multiple Instruction, Single Data
- Rare in practice
- Different operations on the same data
- Example: Fault-tolerant systems

### MIMD - Multiple Instruction, Multiple Data
- Different instructions on different data
- Example: Multi-core CPUs, distributed systems
- **Modern GPUs also support MIMD** through multiple streaming multiprocessors

## Amdahl's Law: The Parallelization Limit

**Amdahl's Law** tells us the theoretical speedup when parallelizing a program:

\`\`\`
Speedup = 1 / ((1 - P) + P/N)

Where:
P = Fraction of program that can be parallelized
N = Number of processors
\`\`\`

### Key Insight

**Even with infinite processors, you can't overcome the sequential portion!**

#### Example Calculation

Suppose 95% of your code can be parallelized (P = 0.95) and you have 1000 GPU cores (N = 1000):

\`\`\`
Speedup = 1 / ((1 - 0.95) + 0.95/1000)
        = 1 / (0.05 + 0.00095)
        = 1 / 0.05095
        ≈ 19.6x
\`\`\`

Despite having 1000 cores, you only get ~20x speedup because 5% of the code must run sequentially!

If only 90% is parallelizable:
\`\`\`
Speedup = 1 / (0.10 + 0.90/1000) ≈ 9.9x
\`\`\`

The sequential bottleneck dominates!

### Implications for GPU Programming

1. **Minimize sequential code** - Even small sequential portions limit speedup
2. **Maximize parallelizable work** - Structure algorithms for parallelism
3. **Consider overhead** - GPU kernel launch has overhead; worth it for large datasets
4. **Data transfer costs** - Moving data to/from GPU takes time

## Gustafson's Law: An Alternative View

Gustafson's Law offers a more optimistic perspective:

\`\`\`
Speedup = N - α(N - 1)

Where:
N = Number of processors
α = Fraction of time spent on sequential parts
\`\`\`

**Key difference**: As problem size grows, the parallel portion grows faster than the sequential portion. With bigger problems, GPUs shine even more!

## Parallelism in Deep Learning

Deep learning is **inherently parallel** at multiple levels:

### 1. Batch Parallelism
Process multiple training samples simultaneously
\`\`\`
batch_size = 256  # Process 256 images at once!
\`\`\`

### 2. Matrix Operations
Matrix multiplication is highly parallel
\`\`\`
C[i,j] = Σ A[i,k] * B[k,j]  // Each C[i,j] computed independently
\`\`\`

### 3. Element-wise Operations
Activations, normalization—all element-wise!
\`\`\`
output = ReLU(input)  // Each element independent
\`\`\`

### 4. Multiple Layers
With pipelining, different samples can be at different network layers simultaneously.

## Practical Takeaways

✅ **GPUs excel at**: Data parallelism, matrix operations, element-wise operations
❌ **GPUs struggle with**: Heavy branching, small datasets, sequential dependencies
📊 **Best performance**: High parallelizable fraction, large datasets, minimal CPU-GPU transfer

Understanding these parallelism fundamentals is crucial for effectively using GPUs in ML/DL workflows.`
      },
      {
        id: 'cpu-vs-gpu',
        title: 'CPU vs GPU Architecture',
        content: `CPUs and GPUs represent fundamentally different design philosophies, each optimized for different types of workloads. Understanding these differences is crucial for choosing the right tool for your task.

## Architectural Philosophy

### CPU: The Generalist (Low Latency)

CPUs are designed as **low-latency processors** optimized for sequential task execution:

**Design Priorities**:
- Fast execution of single threads
- Low latency (minimize time per instruction)
- Complex control logic for out-of-order execution
- Large caches to hide memory latency
- Branch prediction for conditional code
- Support for diverse workloads

**Analogy**: A CPU is like a small team of expert chefs who can quickly adapt to any recipe, working efficiently on complex, varied dishes.

### GPU: The Specialist (High Throughput)

GPUs are designed as **high-throughput processors** optimized for parallel data processing:

**Design Priorities**:
- Maximum throughput (operations per second)
- Massive parallelism (thousands of threads)
- Simple control logic per core
- High memory bandwidth
- SIMD execution model
- Optimized for repetitive operations

**Analogy**: A GPU is like a massive assembly line with thousands of workers, each performing the same simple task repeatedly—incredibly efficient for mass production but inflexible.

## Die Area Allocation

How CPUs and GPUs use their silicon budget reveals their design philosophy:

### CPU Die Breakdown
- **Large Caches**: 40-50% of die area
  - L1, L2, L3 caches to hide memory latency
  - Store frequently accessed data close to cores
- **Control Logic**: 25-30%
  - Branch prediction
  - Out-of-order execution
  - Instruction decoding
- **ALUs (Compute)**: 15-20%
  - Actual arithmetic and logic units
- **Other**: 10-15%
  - Memory controllers, I/O

### GPU Die Breakdown
- **ALUs (Compute)**: 60-70% of die area ⭐
  - Thousands of simple cores
  - Maximized computational throughput
- **Control Logic**: 5-10%
  - Simpler per-core logic
  - Shared across many cores
- **Cache**: 10-15%
  - Smaller per-core caches
  - Compensated by bandwidth
- **Other**: 10-20%
  - Memory controllers, interconnects

**Key Takeaway**: CPUs invest in latency-hiding (caches, control), GPUs invest in throughput (ALUs).

## Core Comparison

### CPU Cores

**Characteristics**:
- **Count**: 4-64 cores (typical desktop/server)
- **Clock Speed**: 3-5 GHz
- **Complexity**: High
  - Out-of-order execution
  - Speculative execution
  - Branch prediction
- **Independence**: Each core largely independent
- **Best For**: Complex, sequential tasks

**Performance**:
- High single-threaded performance
- Excellent for branchy code
- Fast context switching

### GPU Cores

**Characteristics**:
- **Count**: 5,000-20,000+ cores
- **Clock Speed**: 1-2 GHz
- **Complexity**: Low
  - In-order execution
  - No branch prediction per core
  - SIMD lockstep execution
- **Grouping**: Cores grouped in Streaming Multiprocessors (SMs)
- **Best For**: Data-parallel workloads

**Performance**:
- Massive parallel throughput
- Struggles with branching
- High context switch overhead

## Memory Architecture

### CPU Memory

\`\`\`
CPU Core
    ↓
L1 Cache (32-64 KB, 1-2 cycles)
    ↓
L2 Cache (256 KB-1 MB per core, ~10 cycles)
    ↓
L3 Cache (8-64 MB shared, ~40 cycles)
    ↓
Main RAM (16-256 GB, ~100-200 cycles)
\`\`\`

**Bandwidth**: 50-100 GB/s
**Latency**: Optimized to be low (large caches)
**Strategy**: Hide latency with large caches

### GPU Memory

\`\`\`
SM (Streaming Multiprocessor)
    ↓
L1/Shared Memory (128 KB per SM, ~20 cycles)
    ↓
L2 Cache (40-80 MB shared, ~200 cycles)
    ↓
Global Memory/VRAM (16-80 GB HBM, ~400 cycles)
\`\`\`

**Bandwidth**: 1,000-3,000 GB/s ⭐
**Latency**: Higher than CPU, but...
**Strategy**: Hide latency with massive parallelism (run other threads while waiting)

## Performance Metrics Comparison

### Modern High-End Comparison

| Metric | CPU (AMD Ryzen 9 7950X) | GPU (NVIDIA A100) | GPU Advantage |
|--------|-------------------------|-------------------|---------------|
| Cores | 16 | 6,912 | 432x |
| Threads | 32 | 128,000+ warps | 4,000x+ |
| Clock Speed | 4.5 GHz | 1.4 GHz | 0.3x |
| FP32 TFLOPS | ~1.4 | 19.5 | 14x |
| FP16 TFLOPS | N/A | 312 (with Tensor Cores) | N/A |
| Memory Bandwidth | 67 GB/s | 1,935 GB/s | 29x |
| Memory Size | Up to 128 GB DDR5 | 40-80 GB HBM2e | Similar |
| Power | 170W | 400W | 2.3x |
| Price | ~$500 | ~$10,000 | 20x |

**Perf/$**: Despite higher absolute cost, GPUs offer better performance per dollar for parallel workloads.

**Perf/Watt**: GPUs are more power-efficient for their specialized tasks (19.5 TFLOPS / 400W = 48.75 GFLOPS/W vs 1.4 TFLOPS / 170W = 8.2 GFLOPS/W).

## When to Use CPU vs GPU

### Use CPU When:

✅ **Sequential Tasks**: Code with dependencies between steps
\`\`\`python
result = 0
for i in range(n):
    result = complex_function(result, data[i])  # Depends on previous result
\`\`\`

✅ **Branchy Code**: Heavy conditional logic
\`\`\`python
if condition1:
    if condition2:
        # Complex nested logic
    else:
        # Different path
\`\`\`

✅ **Small Datasets**: GPU overhead not worth it
\`\`\`python
matrix_multiply(A_10x10, B_10x10)  # Too small for GPU
\`\`\`

✅ **Low Latency Critical**: Real-time systems requiring fast response
✅ **Complex Algorithms**: Graph traversal, tree search, dynamic programming
✅ **I/O Bound**: Frequent file system or network access

### Use GPU When:

✅ **Data Parallelism**: Same operation on many elements
\`\`\`python
output = activation(weights @ input)  # Matrix multiply + element-wise
\`\`\`

✅ **Large Matrices**: Linear algebra operations
\`\`\`python
C = A @ B  # Where A and B are 4096x4096
\`\`\`

✅ **Element-wise Operations**: Independent computations
\`\`\`python
output = torch.relu(input)  # Each element independent
\`\`\`

✅ **Batch Processing**: Multiple samples processed identically
\`\`\`python
predictions = model(batch_of_images)  # 256 images at once
\`\`\`

✅ **High Throughput**: Total work done matters more than individual latency
✅ **Deep Learning**: Training/inference of neural networks
✅ **Scientific Computing**: Molecular dynamics, CFD, signal processing

## Hybrid Approach: CPU + GPU

Modern applications often use **both** for optimal performance:

\`\`\`python
# CPU: Data loading, preprocessing, orchestration
data_batch = cpu_load_and_preprocess()

# GPU: Intensive computation
data_gpu = data_batch.to('cuda')
output = model(data_gpu)  # Neural network forward pass
loss = criterion(output, labels_gpu)

# GPU: Backpropagation
loss.backward()
optimizer.step()

# CPU: Logging, checkpoint saving
if step % 100 == 0:
    cpu_save_checkpoint()
\`\`\`

**Best Practice**: Keep data on GPU across multiple operations to minimize CPU-GPU transfer overhead.

## Practical Implications for ML/DL

### Why Deep Learning Loves GPUs:

1. **Matrix Multiplication Everywhere**
   - Forward pass: `Y = W × X`
   - Backward pass: `∂L/∂W = ∂L/∂Y × X^T`
   - Perfect for GPU parallelism

2. **Batch Processing**
   - Process 32, 64, 256+ samples simultaneously
   - Identical operations on each sample

3. **Element-wise Operations**
   - Activations: ReLU, sigmoid, tanh
   - Normalization: BatchNorm, LayerNorm
   - All perfectly parallel

4. **High Computational Intensity**
   - Modern models: billions of parameters
   - Training requires trillions of operations
   - GPU throughput advantage shines

### Real-World Impact:

- **ResNet-50 on ImageNet**: 100x faster on GPU
- **BERT training**: Days → Hours with multi-GPU
- **GPT-3 training**: Impossible on CPUs alone (would take centuries!)

Understanding CPU vs GPU architectures helps you write better code, choose appropriate hardware, and optimize your ML/DL workflows effectively.`
      },
      {
        id: 'ai-ml-applications',
        title: 'GPUs in Modern AI and Machine Learning',
        content: `GPUs have become the computational backbone of modern AI and machine learning. Understanding this synergy is crucial for ML/DL researchers and practitioners.

## Why GPUs Dominate Deep Learning

### Perfect Architectural Match

Deep learning and GPUs are a match made in computational heaven. Here's why:

#### 1. Matrix Operations Everywhere

Neural networks are fundamentally built on linear algebra:

**Forward Pass**:
\`\`\`
Y = σ(W × X + b)
\`\`\`

**Backward Pass (Backpropagation)**:
\`\`\`
∂L/∂W = ∂L/∂Y × X^T
∂L/∂X = W^T × ∂L/∂Y
\`\`\`

Every layer involves matrix multiplication—the GPU's specialty!

**Example**: A single fully connected layer with 1024 input neurons and 2048 output neurons:
- Forward pass: 1,024 × 2,048 = ~2.1 million multiply-add operations
- All can be done in parallel on GPU!

#### 2. Data Parallelism in Mini-Batch Training

Modern deep learning uses **mini-batch gradient descent**:

\`\`\`python
# Instead of processing one sample at a time (slow)
for sample in dataset:
    output = model(sample)
    loss = criterion(output, label)
    loss.backward()

# Process a batch of samples simultaneously (fast!)
for batch in dataloader:  # batch_size = 256
    output = model(batch)  # 256 samples processed in parallel!
    loss = criterion(output, labels)
    loss.backward()
\`\`\`

Each sample in the batch undergoes identical operations—perfect for GPU's SIMD architecture.

#### 3. Element-wise Operations

Neural networks are full of element-wise operations that are trivially parallelizable:

**Activations**:
\`\`\`python
# ReLU: max(0, x) for every element
output = torch.relu(input)  # Millions of elements, all parallel

# Sigmoid: 1/(1 + e^(-x)) for every element
output = torch.sigmoid(input)
\`\`\`

**Normalization**:
\`\`\`python
# Batch normalization: normalize each feature
output = (input - mean) / sqrt(variance + eps)
\`\`\`

**Dropout**:
\`\`\`python
# Randomly zero elements
mask = torch.rand_like(input) > 0.5
output = input * mask
\`\`\`

All of these operate independently on each element—GPU parallelism at its finest!

## The Deep Learning Training Pipeline

Let's trace a complete training iteration and see where GPUs excel:

### Step 1: Data Loading
\`\`\`python
# Typically on CPU
images, labels = next(dataloader)
# Transfer to GPU
images = images.cuda()
labels = labels.cuda()
\`\`\`
**Parallelism**: Low (I/O bound)

### Step 2: Forward Pass
\`\`\`python
output = model(images)  # Through all layers
\`\`\`

**What happens inside**:
\`\`\`
Conv2D:  Convolution operations (lots of matrix ops!)
BatchNorm: Normalize features (element-wise)
ReLU: Activation (element-wise)
MaxPool: Pooling (parallel within spatial dimensions)
Linear: Matrix multiplication
Softmax: Normalization (element-wise + reduction)
\`\`\`
**Parallelism**: ⭐⭐⭐ Very High

### Step 3: Loss Computation
\`\`\`python
loss = criterion(output, labels)
\`\`\`
**Parallelism**: ⭐⭐ High (parallel across batch)

### Step 4: Backward Pass
\`\`\`python
loss.backward()  # Compute gradients
\`\`\`

**What happens**:
- Gradients computed for each layer (backpropagation)
- More matrix multiplications!
- Chain rule applied element-wise

**Parallelism**: ⭐⭐⭐ Very High

### Step 5: Weight Update
\`\`\`python
optimizer.step()  # Update all parameters
\`\`\`

**What happens**:
\`\`\`
# For each parameter
param = param - learning_rate * param.grad
\`\`\`
**Parallelism**: ⭐⭐⭐ Very High (millions of parameters updated in parallel)

## Real-World Performance Impact

### Training ResNet-50 on ImageNet

**Dataset**: 1.2 million images, 1000 classes
**Model**: 25.6 million parameters

| Hardware | Time per Epoch | Total Training Time (90 epochs) |
|----------|----------------|----------------------------------|
| CPU (32-core Xeon) | ~40 hours | ~150 days |
| Single GPU (A100) | ~15 minutes | ~22.5 hours |
| 8x GPUs (A100) | ~2 minutes | ~3 hours |

**Speedup**: ~1,200x (CPU to 8x GPU)!

### Training BERT-Large

**Model**: 340 million parameters
**Dataset**: Large text corpus

| Setup | Training Time |
|-------|---------------|
| CPU | ~1 year (estimated) |
| Single V100 GPU | ~30 days |
| 64x V100 GPUs | ~10 hours |

Without GPUs, modern NLP would be impossible!

### Training GPT-3

**Model**: 175 billion parameters
**Compute**: ~3,640 petaflop/s-days

- Would take **355 years** on a single V100
- Used **~10,000 V100s** in parallel
- Actual training time: Several weeks

**Reality**: Without GPUs, GPT-3 could never have been trained!

## Specialized GPU Features for AI

Modern GPUs include hardware specifically designed for deep learning:

### 1. Tensor Cores

Introduced in NVIDIA Volta (2017), Tensor Cores are specialized units for matrix multiply-accumulate operations:

**Standard CUDA Core**:
\`\`\`
D = A * B + C  # One scalar operation
\`\`\`

**Tensor Core**:
\`\`\`
D[4x4] = A[4x4] * B[4x4] + C[4x4]  # 16 operations at once!
\`\`\`

**Performance Impact**:
- Up to **8x faster** for FP16 matrix operations
- Up to **20x faster** with sparsity and FP8 (Hopper)
- Automatic with PyTorch/TensorFlow when using mixed precision

### 2. Mixed Precision Training

Use FP16 for computation, FP32 for accumulation:

\`\`\`python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

with autocast():  # Automatic FP16
    output = model(input)
    loss = criterion(output, target)

scaler.scale(loss).backward()
scaler.step(optimizer)
scaler.update()
\`\`\`

**Benefits**:
- 2-3x faster training
- 50% less memory (fit larger batches/models)
- Minimal accuracy loss

### 3. High Bandwidth Memory (HBM)

Modern GPUs use HBM instead of GDDR:

| Memory Type | Bandwidth | Used In |
|-------------|-----------|---------|
| DDR4 (CPU) | ~50 GB/s | CPUs |
| GDDR6 (GPU) | ~500 GB/s | Gaming GPUs |
| HBM2 | ~900 GB/s | V100 |
| HBM2e | ~2,000 GB/s | A100 |
| HBM3 | ~3,000 GB/s | H100 |

**Why it matters**: Feed thousands of cores with data!

### 4. NVLink

High-speed GPU-to-GPU interconnect:

- **PCIe 4.0**: 64 GB/s bidirectional
- **NVLink 3.0**: 600 GB/s bidirectional
- **NVLink 4.0 (H100)**: 900 GB/s bidirectional

**Use case**: Multi-GPU training, model parallelism

### 5. Transformer Engine (Hopper)

Specialized hardware for transformer models:

- FP8 precision (8-bit floating point)
- Dynamic range adjustment
- 2x speedup for transformer inference
- Optimized for attention mechanisms

## GPU Utilization Patterns in ML/DL

### Convolutional Neural Networks (CNNs)

**GPU Strengths**:
- Convolution = lots of multiply-accumulate ops
- Spatial parallelism (across image)
- Batch parallelism (across samples)
- Channel parallelism (across filters)

**Typical GPU Utilization**: 85-95%

### Transformer Models (BERT, GPT, etc.)

**GPU Strengths**:
- Self-attention: Matrix multiplications
- Feed-forward: Large linear layers
- Batch + sequence parallelism

**Challenges**:
- Variable sequence lengths (padding overhead)
- Attention memory grows quadratically

**Typical GPU Utilization**: 70-85%

### Graph Neural Networks (GNNs)

**GPU Strengths**:
- Message passing can be parallelized
- Aggregation operations

**Challenges**:
- Irregular graph structures
- Load imbalance across nodes

**Typical GPU Utilization**: 50-70% (improving with better frameworks)

## Practical Tips for ML/DL on GPUs

### 1. Maximize Batch Size
\`\`\`python
# Bad: Small batch, GPU underutilized
batch_size = 8

# Good: Large batch, better GPU utilization
batch_size = 256  # or as large as memory allows
\`\`\`

### 2. Minimize CPU-GPU Transfers
\`\`\`python
# Bad: Moving data back and forth
for epoch in range(epochs):
    for batch in dataloader:
        batch_cpu = batch
        batch_gpu = batch_cpu.cuda()  # Transfer
        output = model(batch_gpu)
        output_cpu = output.cpu()  # Transfer

# Good: Keep data on GPU
model = model.cuda()
for epoch in range(epochs):
    for batch in dataloader:
        batch = batch.cuda()  # Transfer once
        output = model(batch)  # Stay on GPU
        loss = criterion(output, labels)  # Stay on GPU
        loss.backward()  # Stay on GPU
        optimizer.step()  # Stay on GPU
\`\`\`

### 3. Use Mixed Precision
\`\`\`python
# Automatic mixed precision for 2-3x speedup
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()
for batch in dataloader:
    with autocast():
        output = model(batch)
        loss = criterion(output, labels)
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
\`\`\`

### 4. Asynchronous Data Loading
\`\`\`python
# Use num_workers for parallel data loading
dataloader = DataLoader(
    dataset,
    batch_size=256,
    num_workers=4,  # Parallel CPU workers
    pin_memory=True  # Faster CPU-GPU transfer
)
\`\`\`

### 5. Gradient Accumulation for Large Models
\`\`\`python
# Simulate larger batch sizes
accumulation_steps = 4
optimizer.zero_grad()

for i, batch in enumerate(dataloader):
    output = model(batch)
    loss = criterion(output, labels) / accumulation_steps
    loss.backward()

    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()
\`\`\`

## The AI Revolution is GPU-Powered

**2012**: AlexNet wins ImageNet using GPUs → Computer vision revolution
**2017**: Transformers + GPUs → NLP revolution
**2020**: GPT-3, DALL-E + massive GPU clusters → Generative AI revolution
**2022**: Stable Diffusion, ChatGPT + optimized GPUs → AI goes mainstream

**Bottom Line**: Modern AI research and applications are inseparable from GPU technology. Understanding how to effectively leverage GPUs is essential for any ML/DL practitioner.`
      }
    ],
    visualizations: [
      {
        id: 'evolution-timeline',
        title: 'GPU Evolution Timeline',
        description: 'Interactive timeline showing the evolution of GPU architectures from 1999 to present',
        type: 'interactive',
        component: 'EvolutionTimeline'
      },
      {
        id: 'cpu-gpu-comparison',
        title: 'CPU vs GPU Architecture Comparison',
        description: '3D visualization comparing die area allocation and core structure',
        type: '3d',
        component: 'CPUGPUComparison'
      },
      {
        id: 'amdahl-calculator',
        title: "Amdahl's Law Interactive Calculator",
        description: 'Calculate theoretical speedup based on parallelizable fraction',
        type: 'interactive',
        component: 'AmdahlCalculator'
      },
      {
        id: 'parallel-execution',
        title: 'Parallel Execution Visualization',
        description: 'See how different parallelism types execute',
        type: '2d',
        component: 'ParallelExecution'
      },
      {
        id: 'deep-learning-pipeline',
        title: 'Deep Learning Training Pipeline',
        description: 'Visualize GPU utilization through a training iteration',
        type: 'interactive',
        component: 'DLPipeline'
      }
    ],
    codeExamples: [],
    quizQuestions: [],
    exercises: [],
    resources: []
  }
]
