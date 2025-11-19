import { Module } from './modules'

export const module2: Module = {
  id: 'module2',
  number: 2,
  title: 'GPU Hardware Architecture',
  subtitle: 'Deep dive into GPU components and NVIDIA architecture evolution',
  description: 'Explore streaming multiprocessors, CUDA cores, tensor cores, warp schedulers, and the evolution from Kepler to Hopper architectures.',
  duration: '5-6 hours',
  difficulty: 'intermediate',
  prerequisites: ['Module 1: Introduction to GPU Computing', 'Understanding of basic computer architecture'],
  learningObjectives: [
    'Understand the internal structure of Streaming Multiprocessors (SMs)',
    'Differentiate between CUDA cores, Tensor cores, and RT cores',
    'Comprehend warp execution and scheduling mechanisms',
    'Trace the evolution of NVIDIA GPU architectures',
    'Analyze architectural differences across GPU generations'
  ],
  sections: [
    {
      id: 'streaming-multiprocessors',
      title: 'Streaming Multiprocessors (SMs)',
      content: `The **Streaming Multiprocessor (SM)** is the fundamental building block of NVIDIA GPU architecture. Understanding SMs is crucial to comprehending how GPUs achieve massive parallelism.

## What is a Streaming Multiprocessor?

An SM is a self-contained processing unit that contains:
- Multiple CUDA cores (32-128 depending on architecture)
- Tensor cores (in newer architectures)
- Special function units (SFUs)
- Load/store units (LD/ST)
- Warp schedulers
- Register file
- Shared memory/L1 cache
- Texture and constant cache

**Analogy**: Think of an SM as a small factory floor with multiple workers (CUDA cores), specialized equipment (tensor cores, SFUs), a shared workspace (shared memory), and managers (warp schedulers) coordinating the work.

## SM Architecture Deep Dive

### Modern SM Structure (Ampere GA102)

\`\`\`
Streaming Multiprocessor (SM)
├── 4 Processing Blocks
│   ├── 16 INT32 cores each
│   ├── 16 FP32 cores each
│   ├── 8 FP64 cores each
│   ├── 4 Tensor cores (3rd gen) each
│   └── 1 Warp scheduler each
├── 128 KB Combined L1/Shared Memory
├── 256 KB Register File
├── 4 Texture Units
└── 16 LD/ST Units
\`\`\`

**Total per SM**:
- 64 INT32 cores
- 64 FP32 cores
- 32 FP64 cores
- 16 Tensor cores (3rd generation)
- 4 Warp schedulers
- 128 KB L1/Shared Memory

### A100 SM (Compute Capability 8.0)

Even more impressive:
- 64 FP32 cores
- 32 FP64 cores
- 64 INT32 cores
- 4 Tensor cores (3rd gen with sparsity)
- 192 KB combined L1/shared memory
- 4 warp schedulers

## How SMs Work Together

### Full GPU Structure

A complete GPU contains many SMs working in parallel:

| GPU Model | # of SMs | CUDA Cores | Tensor Cores |
|-----------|----------|------------|--------------|
| RTX 4090 | 128 | 16,384 | 512 |
| A100 | 108 | 6,912 | 432 |
| H100 | 132 | 16,896 | 528 |
| V100 | 80 | 5,120 | 640 |

**Key Insight**: The GPU's massive parallelism comes from having many SMs, each executing many threads simultaneously.

## SM Execution Model

### Thread Organization in SM

1. **Warp**: 32 threads that execute in lockstep (SIMD)
2. **Thread Block**: Up to 1024 threads, divided into warps
3. **Grid**: Many thread blocks distributed across SMs

\`\`\`
Grid of Thread Blocks
    ↓ Distributed across
Multiple SMs
    ↓ Each SM executes
Multiple Warps (32 threads each)
    ↓ Each cycle
Warp Scheduler issues instructions
\`\`\`

### SM Occupancy

**Occupancy** = Active warps / Maximum possible warps

Factors limiting occupancy:
- **Register usage**: Each SM has a fixed register file (256 KB)
- **Shared memory**: 128 KB must be divided among blocks
- **Block size**: Larger blocks = fewer concurrent blocks
- **Warps per SM**: Hardware limit (e.g., 64 warps on Ampere)

**Example Calculation**:
\`\`\`
SM with:
- Max 64 warps
- 256 KB registers
- 128 KB shared memory

Your kernel uses:
- 32 registers/thread
- 48 KB shared memory/block
- 256 threads/block (8 warps)

Register limit: 256 KB / (32 * 32 bytes) = ~250 warps (not limiting)
Shared mem limit: 128 KB / 48 KB = 2 blocks = 16 warps ← LIMITING!
Block limit: 64 warps / 8 = 8 blocks

Occupancy = 16 / 64 = 25%
\`\`\`

## Warp Execution

### What is a Warp?

A **warp** is a group of 32 threads that execute instructions in SIMD fashion. This is the fundamental execution unit of NVIDIA GPUs.

**Why 32?**: Hardware-determined. The warp size has been 32 since the beginning of CUDA and remains so for compatibility.

### Warp Scheduling

Each SM has multiple warp schedulers (2-4 depending on architecture):

**Single Cycle**:
1. Scheduler selects a warp ready to execute
2. Issues instruction to that warp
3. All 32 threads execute the same instruction (if no divergence)
4. Next cycle: select different warp

**Zero-overhead context switching**: Switching between warps is free! This is how GPUs hide memory latency.

### Latency Hiding

\`\`\`
Cycle 1: Warp 0 executes → requests data from memory (400 cycles latency)
Cycle 2: Warp 1 executes
Cycle 3: Warp 2 executes
...
Cycle 400: Warp 0's data arrives, ready to execute again
\`\`\`

With enough warps, the SM is always doing useful work!

## Specialized Execution Units

### CUDA Cores

**Purpose**: General-purpose FP32 and INT32 operations

**Operations**:
- Floating-point arithmetic (add, multiply, multiply-add)
- Integer arithmetic
- Comparison operations
- Bitwise operations

**Performance**: 1 operation per core per cycle

### Tensor Cores

**Purpose**: Accelerate matrix multiply-accumulate operations for AI

**Operation**: D = A × B + C (where A, B, C, D are matrices)

**Volta (1st gen)**: 4×4×4 matrix operation (FP16 input, FP32 accumulate)
**Turing (2nd gen)**: Added INT8, INT4, INT1 support
**Ampere (3rd gen)**:
- TF32 (19-bit) for FP32-like performance
- FP64 support
- Sparse matrix acceleration (2:4 structured sparsity)

**Hopper (4th gen)**:
- FP8 support (Transformer Engine)
- Improved sparsity
- Thread block clusters

**Performance Impact**:
- Volta: Up to 125 TFLOPS (vs 15.7 TFLOPS CUDA cores)
- A100: Up to 312 TFLOPS (FP16 with sparsity)
- H100: Up to 1,000 TFLOPS (FP8 with sparsity)

### Special Function Units (SFUs)

**Purpose**: Accelerate transcendental functions

**Operations**:
- sin, cos, tan
- exp, log
- sqrt, rsqrt
- Reciprocal

**Performance**: Lower throughput than CUDA cores (1/4 to 1/8), but much faster than software implementation

## Memory Hierarchy within SM

### Register File

- **Size**: 256 KB per SM (Ampere)
- **Speed**: 1 cycle latency
- **Scope**: Private to each thread
- **Usage**: Local variables, frequently accessed data

### Shared Memory / L1 Cache

- **Size**: 128 KB (configurable split between L1 and shared)
- **Speed**: ~20-30 cycle latency
- **Scope**: Shared among threads in a block
- **Usage**: Inter-thread communication, data reuse

### L2 Cache

- **Size**: 6-40 MB (shared across all SMs)
- **Speed**: ~200 cycle latency
- **Scope**: Global
- **Usage**: Caching global memory accesses

## SM Evolution Across Architectures

### Kepler (2012) - Compute Capability 3.x

- **Innovation**: Dynamic parallelism, Hyper-Q
- **SM Structure**: 192 CUDA cores per SM
- **Registers**: 256 KB
- **Shared/L1**: 64 KB (configurable)
- **Warp Schedulers**: 4

### Maxwell (2014) - Compute Capability 5.x

- **Innovation**: Improved power efficiency
- **SM Structure**: 128 CUDA cores per SMM
- **Notable**: Redesigned for gaming, power efficiency over compute

### Pascal (2016) - Compute Capability 6.x

- **Innovation**: HBM2, NVLink, unified memory
- **SM Structure**: 64 CUDA cores per SM
- **Registers**: 256 KB
- **Shared/L1**: 64 KB
- **16-bit float (FP16)**: 2x throughput

### Volta (2017) - Compute Capability 7.0

- **Innovation**: Tensor Cores! Independent thread scheduling
- **SM Structure**: 64 FP32, 64 INT32, 32 FP64, 8 Tensor cores
- **Shared/L1**: 128 KB (configurable)
- **Tensor Core Performance**: 125 TFLOPS (FP16)

### Turing (2018) - Compute Capability 7.5

- **Innovation**: RT Cores (ray tracing), 2nd-gen Tensor Cores
- **Tensor Cores**: INT8, INT4, INT1 support
- **RT Cores**: Dedicated ray tracing acceleration

### Ampere (2020) - Compute Capability 8.x

- **Innovation**: 3rd-gen Tensor Cores, sparsity, MIG
- **SM Structure**: 64 FP32, 64 INT32, 32 FP64, 16 Tensor cores
- **Tensor Features**: TF32, FP64, sparse acceleration
- **MIG**: Multi-Instance GPU (partition A100 into 7 instances)

### Hopper (2022) - Compute Capability 9.0

- **Innovation**: Transformer Engine, 4th-gen Tensor Cores
- **FP8 Support**: 2x performance for transformers
- **Thread Block Clusters**: New hierarchy level
- **Asynchronous Execution**: DPX instructions
- **Confidential Computing**: Trusted Execution Environment

## Practical Implications

### For Developers

1. **Warp-level thinking**: Design algorithms with 32-thread warps in mind
2. **Occupancy matters**: Aim for 50%+ occupancy for good latency hiding
3. **Resource usage**: Balance registers vs shared memory vs blocks
4. **Specialized units**: Use Tensor Cores for matrix ops, SFUs for transcendentals

### For ML/DL

1. **Tensor Cores are crucial**: 8-20x speedup for training
2. **Mixed precision**: Use FP16/TF32 to maximize Tensor Core utilization
3. **Batch size**: Larger batches = better SM utilization
4. **Memory-bound vs compute-bound**: Profile to understand bottlenecks

## Summary

The Streaming Multiprocessor is the heart of GPU parallelism:
- Contains dozens of CUDA cores + specialized units
- Executes warps of 32 threads in SIMD fashion
- Uses massive multithreading to hide latency
- Evolution from Kepler to Hopper shows continuous innovation
- Understanding SMs is key to writing efficient GPU code

Modern GPUs contain 100+ SMs working in parallel, each executing thousands of threads simultaneously—this is the source of the GPU's incredible computational power.`
    },
    {
      id: 'cuda-cores',
      title: 'CUDA Cores and Execution Units',
      content: `CUDA cores are the fundamental computational units of NVIDIA GPUs. Understanding their operation and how they differ from CPU cores is essential for GPU programming.

## What is a CUDA Core?

A **CUDA core** is a single-threaded processor capable of executing one floating-point or integer operation per clock cycle.

**Critical Distinction from CPU Cores**:
- **CPU Core**: Complex, out-of-order, multi-threaded, ~4GHz, can execute multiple instructions/cycle
- **CUDA Core**: Simple, in-order, single-threaded, ~1.5GHz, executes one instruction/cycle

**Why GPUs win**: Thousands of CUDA cores vs dozens of CPU cores!

## CUDA Core Architecture

### Internal Structure

A CUDA core contains:
1. **Arithmetic Logic Unit (ALU)**: Integer and floating-point arithmetic
2. **Floating-Point Unit (FPU)**: IEEE 754 compliant FP operations
3. **Integer Unit (IU)**: Integer arithmetic and bitwise ops
4. **Minimal control logic**: Shared with other cores in the SM

### Operations Supported

**Floating-Point (FP32)**:
- Addition, subtraction
- Multiplication
- Fused multiply-add (FMA): a = b * c + d (single rounding!)
- Comparison

**Integer (INT32)**:
- Addition, subtraction
- Multiplication (24-bit)
- Bitwise AND, OR, XOR, NOT
- Shifts

**Special Functions** (via SFU):
- Trigonometric: sin, cos, tan
- Exponential: exp, log, pow
- Square root: sqrt, rsqrt

## CUDA Core Types

### FP32 Cores (Single Precision)

**Standard for**:
- Graphics rendering
- Scientific computing
- Traditional neural networks

**Precision**: ~7 decimal digits
**Range**: ±3.4 × 10³⁸
**Performance**: Highest throughput (measured in TFLOPS)

**Example: A100**
- 6,912 FP32 cores
- Peak: 19.5 TFLOPS
- Boost clock: ~1.4 GHz
- 19,500,000,000,000 operations/second!

### FP64 Cores (Double Precision)

**Used for**:
- Scientific simulations requiring high precision
- Molecular dynamics
- Climate modeling
- Financial calculations

**Precision**: ~16 decimal digits
**Range**: ±1.7 × 10³⁰⁸

**Performance Ratios**:
- **Gaming GPUs**: FP64 = 1/32 of FP32 (deliberately limited)
- **Tesla/Quadro**: FP64 = 1/2 of FP32 (A100, V100)
- **H100**: FP64 = 1/2 of FP32

**Why the difference?**: Market segmentation. Deep learning doesn't need FP64, but scientific computing does.

### INT32 Cores (Integer)

**Modern innovation** (Turing+): Concurrent FP32 and INT32 execution

**Before Turing**: Cores could do FP32 OR INT32
**Turing+**: Separate INT32 cores!

**Benefit**: Address calculations (INT32) run in parallel with data computations (FP32)

**Example Workload**:
\`\`\`cuda
// Array indexing (INT32) + computation (FP32)
int idx = blockIdx.x * blockDim.x + threadIdx.x;  // INT32
float value = data[idx] * scale + bias;            // FP32

// Before Turing: Sequential
// Turing+: Parallel!
\`\`\`

## Tensor Cores: Specialized Matrix Engines

Tensor Cores are NOT traditional CUDA cores—they're specialized matrix multiplication accelerators.

### How Tensor Cores Work

**Traditional Matrix Multiply (CUDA cores)**:
\`\`\`
C[i][j] = Σ A[i][k] * B[k][j]
→ Many individual multiply-adds
→ Executed serially or with limited parallelism
\`\`\`

**Tensor Core Operation**:
\`\`\`
D = A × B + C
Where A, B, C, D are small matrices (4×4, 8×8, or 16×16)
→ Entire operation in ONE instruction!
→ Massive acceleration
\`\`\`

### Tensor Core Evolution

#### Volta (1st Generation) - 2017

**Operation**: 4×4×4 matrix multiply-accumulate
**Precision**: FP16 input, FP32 accumulate
**Performance**: 125 TFLOPS (vs 15.7 CUDA core TFLOPS)

\`\`\`
D (FP32) = A (FP16) × B (FP16) + C (FP32)
\`\`\`

**Impact**: 8x speedup for deep learning!

#### Turing (2nd Generation) - 2018

**Added**: INT8, INT4, INT1 support
**Use cases**:
- INT8: Inference optimization
- INT4/INT1: Ultra-efficient inference

#### Ampere (3rd Generation) - 2020

**Major Additions**:

1. **TF32 (TensorFloat-32)**:
   - 19-bit format (8-bit exponent, 10-bit mantissa)
   - Automatic for FP32 matrix ops
   - Same range as FP32, precision between FP32 and FP16
   - **No code changes required!**
   - 8x speedup vs FP32 CUDA cores

2. **FP64 Tensor Cores**:
   - First FP64 Tensor Cores ever
   - 2.5x faster than FP64 CUDA cores
   - Critical for scientific computing

3. **Structured Sparsity**:
   - 2:4 sparsity (2 zeros in every 4 values)
   - 2x speedup if sparsity present
   - Works with pruned neural networks

**Performance Jump**:
- A100 FP16: 312 TFLOPS (with sparsity)
- A100 TF32: 156 TFLOPS
- A100 FP64: 19.5 TFLOPS

#### Hopper (4th Generation) - 2022

**Transformer Engine**:
- **FP8 precision**: 8-bit floating point!
  - E4M3: 4-bit exponent, 3-bit mantissa
  - E5M2: 5-bit exponent, 2-bit mantissa
- **Dynamic format switching**: Automatically choose E4M3 or E5M2
- **2x speedup** vs FP16 for transformers

**Thread Block Clusters**:
- New execution hierarchy
- Enables larger collaborative computations

**Performance**:
- H100 FP8: 1,000 TFLOPS (with sparsity!)
- H100 FP16: 500 TFLOPS
- H100 TF32: 250 TFLOPS

## RT Cores (Ray Tracing)

**Purpose**: Hardware-accelerated ray tracing
**First introduced**: Turing (2018)

### What RT Cores Do

1. **BVH (Bounding Volume Hierarchy) traversal**: Navigate scene geometry
2. **Ray-triangle intersection**: Check if rays hit surfaces
3. **Ray-box intersection**: Accelerate traversal

**Performance**: 10 Giga Rays/second (RTX 4090)

**ML Application**: Not directly used for traditional ML, but important for:
- NeRFs (Neural Radiance Fields)
- 3D reconstruction
- Synthetic data generation

## Execution Unit Comparison

| Unit | Purpose | Throughput | Precision | Best For |
|------|---------|-----------|-----------|----------|
| CUDA Core (FP32) | General compute | High | Single | General ML/DL |
| CUDA Core (FP64) | High precision | Med-High* | Double | Scientific computing |
| CUDA Core (INT32) | Integer ops | High | Integer | Indexing, control |
| Tensor Core (FP16) | Matrix multiply | Very High | Half | DL training |
| Tensor Core (TF32) | Matrix multiply | Very High | ~FP32 | DL training (auto) |
| Tensor Core (FP8) | Matrix multiply | Extreme | 8-bit | LLM inference |
| SFU | Transcendentals | Low | Single | sin, cos, exp |
| RT Core | Ray tracing | N/A | N/A | Graphics, NeRFs |

*Med-High only on datacenter GPUs; Low on consumer GPUs

## Practical Usage Patterns

### For Deep Learning

**Training**:
\`\`\`python
# Automatic Tensor Core usage with PyTorch
from torch.cuda.amp import autocast

with autocast():
    output = model(input)  # Uses Tensor Cores automatically!
    loss = criterion(output, target)
\`\`\`

**Benefits**:
- 2-8x faster training
- 50% less memory (can double batch size)
- Minimal accuracy loss

### For Scientific Computing

**High-precision simulations**:
\`\`\`cuda
__global__ void doubleSimulation(double* data) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    // Uses FP64 CUDA cores
    data[idx] = sqrt(data[idx] * data[idx] + 1.0);
}
\`\`\`

**Mixed approach**:
- Use FP32 where precision allows
- Use FP64 only where necessary
- Profile to find bottlenecks

### Maximizing Utilization

**Keys to high CUDA core utilization**:

1. **Enough warps**: Keep all cores busy
2. **Minimize divergence**: All threads in warp doing same thing
3. **Memory coalescing**: Efficient memory access patterns
4. **Occupancy**: Balance registers, shared memory, threads

## Summary

**CUDA Cores**:
- Simple, single-threaded processors
- Thousands per GPU
- FP32, FP64, INT32 variants
- Foundation of GPU computing

**Tensor Cores**:
- Specialized for matrix operations
- 8-20x faster than CUDA cores for ML/DL
- Continuous evolution: Volta → Turing → Ampere → Hopper
- Critical for modern AI workloads

**RT Cores**:
- Ray tracing acceleration
- Growing importance for 3D AI applications

**Key Takeaway**: Modern GPUs are heterogeneous—different specialized units for different tasks. The art of GPU programming is using the right unit for each operation.`
    }
  ],
  visualizations: [
    {
      id: 'sm-architecture-3d',
      title: 'SM Architecture Explorer',
      description: '3D visualization of a complete Streaming Multiprocessor with all components',
      type: '3d',
      component: 'SMArchitecture3D'
    },
    {
      id: 'warp-execution-sim',
      title: 'Warp Execution Simulator',
      description: 'See how warps are scheduled and executed across SM cycles',
      type: 'interactive',
      component: 'WarpExecutionSimulator'
    },
    {
      id: 'architecture-evolution',
      title: 'Architecture Evolution Timeline',
      description: 'Interactive timeline comparing specifications across GPU generations',
      type: 'interactive',
      component: 'ArchitectureEvolution'
    },
    {
      id: 'tensor-core-viz',
      title: 'Tensor Core Operation',
      description: 'Visualize how Tensor Cores perform matrix multiplication',
      type: '2d',
      component: 'TensorCoreVisualization'
    },
    {
      id: 'occupancy-calculator',
      title: 'Occupancy Calculator',
      description: 'Calculate theoretical occupancy based on kernel resource usage',
      type: 'interactive',
      component: 'OccupancyCalculator'
    }
  ],
  codeExamples: [],
  quizQuestions: [],
  exercises: [],
  resources: []
}

export const allModulesExpanded: Module[] = [
  module2,
  // Modules 3-8 will be added here
]
